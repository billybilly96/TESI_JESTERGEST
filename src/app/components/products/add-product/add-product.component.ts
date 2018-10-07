import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products/products.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
/** Questo component si occupa della creazione di un singolo prodotto. */
export class AddProductComponent implements OnInit {
  private title: string = 'Nuovo Prodotto · Articoli';
  private token: any = "";
  private create_product_form: FormGroup;
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, 
    private productsService: ProductsService,
    private authService: AuthenticationService, 
    private iDBService: IndexedDBService,
    private titleService: Title, 
    public snackbar: MatSnackBar
  ) {
    this.create_product_form = formBuilder.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
      description: [""],
      notes: [""],
      status: [1, Validators.required],
      barcode: [""],
      type_id: [1],
      measurement_unit: [1],
      stock_minimum_quantity: [""],
      created: new Date(Date.now()),
      modified: new Date(Date.now())
    });
  }

  /** Metodo contenente diverse modalità di aggiunta di un prodotto. */
  addProduct(): void {
    this.loading = true;
    if (!navigator.onLine) {
      this.addProductToServerLater();
    }
    else {
      this.addProductToServer();
    }
    this.addProductToCollection();
  }

  /** Metodo che invia al server il prodotto creato. */
  addProductToServer(): void {
    this.productsService.addProductToServer(this.create_product_form.value, this.token)
      .subscribe(
        success => {
          this.loading = false;
          console.log(success);
          this.snackbar.open("Prodotto creato con successo!","", {
            duration: this.timer,
            panelClass: ['blue-snackbar']
          });
          this.router.navigate(['/products']);
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
  }

  /** Metodo per l'invio di un prodotto in modalità offline. */
  addProductToServerLater(): void {
    this.productsService.post_offline(this.create_product_form.value);
    this.loading = false;
  }

  /** Metodo che aggiunge il prodotto creato nel database locale. */
  addProductToCollection(): void {
    this.iDBService.addProductToCollection(this.create_product_form.value);
    if (!navigator.onLine) {
      this.snackbar.open("Prodotto creato con successo!","", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
      this.router.navigate(['/products']);
    }
  }

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      this.token = token.csrfToken;
    });
  }

  /** Getter del loading. */
  getLoading(): boolean {
    return this.loading;
  }
  /** Getter del titolo della pagina. */
  getPageTitle(): string {
    return this.title;
  }
  /** Getter del form del prodotto da aggiungere. */
  getProductForm(): FormGroup {
    return this.create_product_form;
  }

  ngOnInit() {
    this.titleService.setTitle("Nuovo Prodotto Articoli | Mazapégul");
    if (navigator.onLine) this.checkToken();
  }

}
