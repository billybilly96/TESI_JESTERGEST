import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material';
import { PriceList } from '../../classes/price-lists/price-list';

@Injectable({
  providedIn: 'root'
})
/**
 * Questo servizio ha il compito di contenere la logica delle azioni legate ai
 * listini e di comunicare col server e con i vari components.
 */
export class PriceListsService {
  private url_getAllPriceLists: string = "http://localhost/angular-jestergest-new/price-lists.json";
  private url_getOnePriceList: string = "http://localhost/angular-jestergest-new/price-lists/view/";
  private url_add: string = "http://localhost/angular-jestergest-new/price-lists/add.json?type=1";
  private url_edit: string = "http://localhost/angular-jestergest-new/price-lists/edit/";
  private url_delete: string = "http://localhost/angular-jestergest-new/price-lists/delete/";
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
   * Metodo che scarica dal server tutti i listini.
   */
  getPriceListsFromServer(): Observable<PriceList[]> {
    return this.http.get<PriceList[]>(this.url_getAllPriceLists); 
  }

  /**
   * Metodo che invia al server un nuovo listino creato.
   * @param price_list Contiene i dati del nuovo listino creato.
   */
  addPriceListToServer(price_list, token): Observable<any> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.post<any>(this.url_add, price_list, this.http_options);
  }

  post_offline(price_list): void {
    this.post.push(JSON.stringify(price_list));
    localStorage.setItem("post_price_list", JSON.stringify(this.post));
    console.log("POST PRICE LISTS OFFLINE: ",this.post);
  }

  put_offline(price_list): void {
    this.put.push(JSON.stringify(price_list));
    localStorage.setItem("put_price_list", JSON.stringify(this.put));
    console.log("PUT PRICE LISTS OFFLINE: ",this.put);
  }

  delete_offline(id): void {
    this.delete.push(JSON.stringify(id));
    localStorage.setItem("delete_price_list", JSON.stringify(this.delete));
    console.log("DELETE PRICE LISTS OFFLINE: ",this.delete);
  }

  /**
   * Metodo che scarica dal server un listino avente un determinato ID.
   * @param id ID del listino da scaricare.
   */
  getOnePriceListFromServer(id: number): Observable<PriceList> {
    return this.http.get<PriceList>(this.url_getOnePriceList + id + '.json');
  }

  /**
   * Metodo che invia al server il listino modificato.
   * @param price_list Contiene i dati del listino modificato
   * @param id ID del listino modificato.
   */
  updatePriceListFromServer(price_list, id, token): Observable<PriceList> { 
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.put<PriceList>(this.url_edit + id + '.json', price_list, this.http_options);
  }

  /**
   * Metodo che comunica al server l'eliminazione del listino.
   * @param id ID del prodotto eliminato.
   */
  deletePriceListFromServer(id, token): Observable<PriceList> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.delete<PriceList>(this.url_delete + id + '.json', this.http_options);
  }
}

