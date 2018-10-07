import { Component, OnInit, ViewChild } from '@angular/core';
import { PriceList } from '../../../classes/price-lists/price-list';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { PriceListsService } from '../../../services/price_lists/price-lists.service';

var id_delete;
var my_token: any = "";

@Component({
  selector: 'app-price-lists',
  templateUrl: './price-lists.component.html',
  styleUrls: ['./price-lists.component.scss']
})

export class PriceListsComponent implements OnInit {
  private title: String = 'Listini';
  private price_lists: PriceList[];
  private displayedColumns: String[] = ['code', 'name', 'scope', 'price_rules_count', 'actions'];
  private dataSource = new MatTableDataSource<PriceList>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private titleService: Title,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private iDBService: IndexedDBService,
    private priceListsService: PriceListsService
  ) {}

  openDialog(id): void {
    id_delete = id;
    const dialogRef = this.dialog.open(DialogPriceListDelete, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {});
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

   /** Scarica tutti i listini dal server. */
   getPriceListsFromServer(): void {
    this.priceListsService.getPriceListsFromServer()
      .subscribe(data => {
        this.price_lists = data['price_lists'];
        this.dataSource = new MatTableDataSource(this.price_lists);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  /** Scarica i listini dalla collection locale. */
  getPriceListsFromCollection(): void {
    this.iDBService.getAllPriceLists(price_lists => {
      price_lists.forEach(price_list => {
        price_list.scope = price_list.scope == 1 ? 'Ecommerce+Offline' : price_list.scope == 2 ? 'Ecommerce' : price_list.scope == 3 ? 'Offline' : '--';
        if (price_list.scope == "--" || price_list.valid_to == null) {
          price_list.valid_from = "";
          price_list.valid_to = "";
        }         
        else {
          price_list.valid_from = new Intl.DateTimeFormat("it-IT").format(new Date(price_list.valid_from));
          price_list.valid_from = "da " + price_list.valid_from;
          price_list.valid_to = new Intl.DateTimeFormat("it-IT").format(new Date(price_list.valid_to));
          price_list.valid_to = "a " + price_list.valid_to;
        }
      });
      this.price_lists = price_lists;
      this.dataSource = new MatTableDataSource(this.price_lists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Getter dei listini */
  getPriceListsArray(): PriceList[] {
    return this.price_lists;
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
    this.titleService.setTitle("Listini | Mazapégul");
    this.getPriceListsFromCollection();
  }

}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogPriceListDelete {

  constructor(
    public dialogRef: MatDialogRef<DialogPriceListDelete>,
    private priceListsService: PriceListsService,
    private iDBService: IndexedDBService,
    public snackbar: MatSnackBar,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deletePriceList(): void {
    if (!navigator.onLine) {
      this.deletePriceListFromServerLater();
    }
    else {
      this.deletePriceListFromServer();
    }
    this.deletePriceListFromCollection();
  }

  deletePriceListFromServerLater(): void {
    this.priceListsService.delete_offline(id_delete);
  }

  deletePriceListFromServer(): void {
    this.priceListsService.deletePriceListFromServer(id_delete, my_token)
      .subscribe(
        price_list => { console.log("Eliminazione del listino", price_list, "avvenuta con successo"); this.router.navigate(['/dashboard']); },
        error => console.log(error)
      );
  }

  getPriceListID(): number {
    return id_delete;
  }

  deletePriceListFromCollection(): void {
    this.iDBService.removePriceList(id_delete);
    setTimeout(()=> {
      this.snackbar.open("Listino eliminato con successo!","", {
        duration: 5000,
        panelClass: ['blue-snackbar']
      })
      this.onNoClick();
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

}
