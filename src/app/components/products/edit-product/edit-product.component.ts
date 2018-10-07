import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../classes/products/product';
import { ProductsService } from '../../../services/products/products.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
/** Questo component si occupa della modifica di un singolo prodotto. */
export class EditProductComponent implements OnInit {
  private title: string = 'Modifica Prodotto · Articoli';
  @Input() product: Product;
  private update_product_form: FormGroup;
  private id: number = +this.route.snapshot.paramMap.get('id');
  private token: any = "";
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private iDBService: IndexedDBService,
    private titleService: Title, 
    public snackbar: MatSnackBar
  ) {
    this.update_product_form = this.formBuilder.group({
      id: [this.id],
      code: ["", Validators.required],
      name: ["", Validators.required],
      description: [""],
      notes: [""],
      status: [1, Validators.required],
      barcode: [""],
      type_id: [1],
      measurement_unit: [1],
      stock_minimum_quantity: [""],
      created: [],
      modified: new Date(Date.now())
    });
  }

  updateProduct(): void {
    this.loading = true;
    if (!navigator.onLine) {
      this.updateProductFromServerLater();
    }
    else {
      this.updateProductFromServer();
    }
    this.updateProductFromCollection();
  }

  /** Metodo che invia al server il prodotto modificato. */
  updateProductFromServer(): void {
    this.productsService.updateProductFromServer(this.update_product_form.value, this.update_product_form.value.id, this.token)
      .subscribe( 
        success => {
          console.log(success);
          console.log(this.update_product_form.value);
          this.loading = false;
          this.snackbar.open("Prodotto modificato con successo!","", {
            duration: this.timer,
            panelClass: ['blue-snackbar']
          });
          this.router.navigate(['/products/view/' + this.update_product_form.value.id]);
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
  }

  updateProductFromServerLater(): void {
    this.productsService.put_offline(this.update_product_form.value);
    this.loading = false;
  }

  /** Metodo che aggiorna il prodotto nel database locale con le nuove modifiche. */
  updateProductFromCollection(): void {
    this.iDBService.editProduct(this.update_product_form.value);
    if (!navigator.onLine) {
      this.snackbar.open("Prodotto modificato con successo!","", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
      this.router.navigate(['/products/view/' + this.update_product_form.value.id]);
    }
  }

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      this.token = token.csrfToken;
    });
  }

  /** Prende il prodotto selezionato dal db locale e popola il form. */
  getOneProductFromCollectionAndFillTheForm(): void {
    this.iDBService.getProductByKey(this.id, product => {
      this.product = product;
      this.update_product_form.patchValue({
        code: product.code,
        name: product.name,
        description: product.description,
        notes: product.notes,
        status: product.status,
        barcode: product.barcode,
        type_id: product.type_id,
        measurement_unit: product.measurement_unit,
        stock_minimum_quantity: product.stock_minimum_quantity
      });
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
  /** Getter del form del prodotto. */
  getProductForm(): FormGroup {
    return this.update_product_form;
  }

  ngOnInit() {
    this.titleService.setTitle("Modifica Prodotto Articoli | Mazapégul");
    this.getOneProductFromCollectionAndFillTheForm();
    if (navigator.onLine) this.checkToken();
  }

}
