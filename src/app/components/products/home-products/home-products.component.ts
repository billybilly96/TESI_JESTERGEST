import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'; 
import { MatSnackBar } from "@angular/material";
import { ProductsService } from '../../../services/products/products.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { Product } from '../../../classes/products/product';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';

var id_delete;
var my_token: any = "";

@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss']
})
export class HomeProductsComponent implements OnInit {
  private title: String = 'Prodotti';
  private products: Product[];
  private displayedColumns: String[] = ['select', 'code', 'name', 'description', 'actions'];
  private dataSource = new MatTableDataSource<Product>();
  private selection = new SelectionModel<Product>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( 
    private productService: ProductsService,
    private titleService: Title,
    private iDBService: IndexedDBService,
    public dialog: MatDialog,
    private authService: AuthenticationService
  ) {}

  openDialog(id): void {
    id_delete = id;
    const dialogRef = this.dialog.open(DialogProductDelete, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  /** Controlla se il numero degli elementi selezionati equivale al numero totale di elementi presenti */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Seleziona tutte le righe se non sono state selezionate, altrimenti cancella la selezione */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(product => this.selection.select(product));
  }

  /**
   * Metodo che applica la tipologia di filtraggio all'interno della tabella.
   * @param filterValue La stringa da cercare all'interno della tabella.
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  /** Scarica tutti i prodotti dal server. */
  getProductsFromServer(): void {
    this.productService.getProductsFromServer()
      .subscribe(data => {
        this.products = data['products'];
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  /** Scarica i prodotti dalla collection locale. */
  getProductsFromCollection(): void {
    this.iDBService.getAllProducts(products => {
      this.products = products;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Getter dei prodotti */
  getProductsArray(): Product[] {
    return this.products;
  }
  /** Getter del displayedColums */
  getDisplayedColumns(): String[] {
    return this.displayedColumns;
  }
  /** Getter del dataSource */
  getDataSource(): any {
    return this.dataSource;
  }
  /** Getter del titolo della pagina */
  getPageTitle(): String {
    return this.title;
  }

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      my_token = token.csrfToken;
    });
  }

  ngOnInit() {
    if (navigator.onLine) this.checkToken();
    this.titleService.setTitle("Prodotti | Mazapégul");
    this.getProductsFromCollection();
  }

}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogProductDelete {

  constructor(
    public dialogRef: MatDialogRef<DialogProductDelete>,
    private productService: ProductsService,
    private iDBService: IndexedDBService,
    public snackbar: MatSnackBar,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteProduct(): void {
    if (!navigator.onLine) {
      this.deleteProductFromServerLater();
    }
    else {
      this.deleteProductFromServer();
    }
    this.deleteProductFromCollection();
  }

  deleteProductFromServerLater(): void {
    this.productService.delete_offline(id_delete);
  }

  deleteProductFromServer(): void {
    this.productService.deleteProductFromServer(id_delete, my_token)
      .subscribe(
        product => { console.log("Eliminazione del prodotto", product, "avvenuta con successo"); this.router.navigate(['/dashboard']); },
        error => console.log(error)
      );
  }

  getProductID(): number {
    return id_delete;
  }

  deleteProductFromCollection(): void {
    this.iDBService.removeProduct(id_delete);
    setTimeout(()=> {
      this.snackbar.open("Prodotto eliminato con successo!","", {
        duration: 5000,
        panelClass: ['blue-snackbar']
      })
      this.onNoClick();
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

}
