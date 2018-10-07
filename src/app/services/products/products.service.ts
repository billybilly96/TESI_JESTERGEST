import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material';
import { Product } from '../../classes/products/product';

@Injectable({
  providedIn: 'root'
})
/**
 * Questo servizio ha il compito di contenere la logica delle azioni legate ai
 * prodotti e di comunicare col server e con i vari components.
 */
export class ProductsService {
  private url_getAllProducts: string = "http://localhost/angular-jestergest-new/products.json";
  private url_getOneProduct: string = "http://localhost/angular-jestergest-new/products/view/";
  private url_add: string = "http://localhost/angular-jestergest-new/products/add.json?type_id=1";
  private url_edit: string = "http://localhost/angular-jestergest-new/products/edit/";
  private url_delete: string = "http://localhost/angular-jestergest-new/products/delete/";
  private id: number = +this.route.snapshot.paramMap.get('id');
  private http_options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };
  private post = [];
  private put = [];
  private delete = [];

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute, 
    public snackbar: MatSnackBar
  ) {}

  /**
   * Metodo che scarica dal server tutti i prodotti.
   */
  getProductsFromServer(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url_getAllProducts); 
  }

  /**
   * Metodo che invia al server un nuovo prodotto creato.
   * @param product Contiene i dati del nuovo prodotto creato.
   */
  addProductToServer(product, token): Observable<any> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.post<any>(this.url_add, product, this.http_options);
  }

  post_offline(product): void {
    this.post.push(JSON.stringify(product));
    localStorage.setItem("post_product", JSON.stringify(this.post));
    console.log("POST PRODUCTS OFFLINE: ",this.post);
  }

  put_offline(product): void {
    this.put.push(JSON.stringify(product));
    localStorage.setItem("put_product", JSON.stringify(this.put));
    console.log("PUT PRODUCTS OFFLINE: ",this.put);
  }

  delete_offline(id): void {
    this.delete.push(JSON.stringify(id));
    localStorage.setItem("delete_product", JSON.stringify(this.delete));
    console.log("DELETE PRODUCTS OFFLINE: ",this.delete);
  }

  /**
   * Metodo che scarica dal server un prodotto avente un determinato ID.
   * @param id ID del prodotto da scaricare.
   */
  getOneProductFromServer(id: number): Observable<Product> {
    return this.http.get<Product>(this.url_getOneProduct + id + '.json');
  }

  /**
   * Metodo che invia al server il prodotto modificato.
   * @param product Contiene i dati del prodotto modificato
   * @param id ID del prodotto modificato.
   */
  updateProductFromServer(product, id, token): Observable<Product> { 
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.put<Product>(this.url_edit + id + '.json', product, this.http_options);
  }

  /**
   * Metodo che comunica al server l'eliminazione del prodotto.
   * @param id ID del prodotto eliminato.
   */
  deleteProductFromServer(id, token): Observable<Product> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.delete<Product>(this.url_delete + id + '.json', this.http_options);
  }
}
