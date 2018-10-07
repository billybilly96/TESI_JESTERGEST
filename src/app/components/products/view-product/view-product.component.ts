import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../classes/products/product';
import { ProductsService } from '../../../services/products/products.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
/** Questo component si occupa della visualizzazione di un singolo prodotto. */
export class ViewProductComponent implements OnInit {
  private title: string = 'Vedi Prodotto · Articoli';
  private product: Product;
  private id: number = +this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute, 
    private productsService: ProductsService,
    private iDBService: IndexedDBService,
    private titleService: Title
  ) {}

  /** Scarica un prodotto dal server avente un determinato ID. */
  getOneProductFromServer(): void {
    this.productsService.getOneProductFromServer(this.id).subscribe(data => {
      data['product'].created = new Intl.DateTimeFormat("it-IT").format(new Date(data['product'].created));
      data['product'].modified = new Intl.DateTimeFormat("it-IT").format(new Date(data['product'].modified));
      data['product'].status = data['product'].status == 1 ? 'Disponibile' : 'Non disponibile';
      this.product = data['product'];
    });
  }

  getOneProductFromCollection(): void {
    this.iDBService.getProductByKey(this.id, (product => {
      product.created = new Intl.DateTimeFormat("it-IT").format(new Date(product.created));
      product.modified = new Intl.DateTimeFormat("it-IT").format(new Date(product.modified));
      product.status = product.status == 1 ? 'Disponibile' : 'Non disponibile';
      product.barcode = product.barcode == (null || "") ? '--' : product.barcode;
      product.stock_minimum_quantity = product.stock_minimum_quantity == (null) ? '--' : product.stock_minimum_quantity;
      product.notes = product.notes == (null || "") ? '--' : product.notes;
      product.description = product.description == (null || "") ? '--' : product.description;
      product.measurement_unit = product.measurement_unit == 1 ? 
        'Pz (Pezzi)' : product.measurement_unit == 2 ?
        'Kg (Kilogrammi)' : product.measurement_unit == 3 ?
        'Lt (Litri)' : product.measurement_unit == 4 ?
        'n (Numero)' : "--";
      this.product = product;
    }));
  }

  /** Getter del prodotto. */
  getProductData(): Product {
    return this.product;
  }

  /** Getter del titolo della pagina. */
  getPageTitle(): string {
    return this.title;
  }

  /** Getter dell'ID del prodotto. */
  getID(): number {
    return this.id;
  }

  ngOnInit() {
    this.titleService.setTitle("Vedi Prodotto · Articoli | Mazapégul");
    this.getOneProductFromCollection();
  }

}
