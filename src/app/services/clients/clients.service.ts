import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs";
import { Client } from '../../classes/clients/client';

@Injectable({
  providedIn: 'root'
})
/**
 * Questo servizio ha il compito di contenere la logica delle azioni legate ai
 * clienti e di comunicare col server e con i vari components.
 */
export class ClientsService {
  private url_getAllClients: string = "http://localhost/angular-jestergest-new/clients.json";
  private url_getOneClient: string = "http://localhost/angular-jestergest-new/clients/view/";
  private url_add: string = "http://localhost/angular-jestergest-new/clients/add.json?type_id=1";
  private url_edit: string = "http://localhost/angular-jestergest-new/clients/edit/";
  private url_delete: string = "http://localhost/angular-jestergest-new/clients/delete/";
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
    private route: ActivatedRoute
  ) {}

  /** Metodo che scarica dal server tutti i clienti. */
  getClientsFromServer(): Observable<Client[]> {
    return this.http.get<Client[]>(this.url_getAllClients); 
  }

  /**
   * Metodo che invia al server un nuovo cliente creato.
   * @param client Contiene i dati del nuovo cliente creato.
   */
  addClientToServer(client, token): Observable<Client> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.post<any>(this.url_add, client, this.http_options);
  }

  post_offline(client): void {
    this.post.push(JSON.stringify(client));
    localStorage.setItem("post_client", JSON.stringify(this.post));
    console.log("POST CLIENTS OFFLINE: ",this.post);
  }

  put_offline(client): void {
    this.put.push(JSON.stringify(client));
    localStorage.setItem("put_client", JSON.stringify(this.put));
    console.log("PUT CLIENTS OFFLINE: ",this.put);
  }

  delete_offline(id): void {
    this.delete.push(JSON.stringify(id));
    localStorage.setItem("delete_client", JSON.stringify(this.delete));
    console.log("DELETE CLIENTS OFFLINE: ",this.delete);
  }
  
  /**
   * Metodo che scarica dal server un cliente avente un determinato ID.
   * @param id ID del cliente da scaricare.
   */
  getOneClientFromServer(id: number): Observable<Client> {
    return this.http.get<Client>(this.url_getOneClient + id + '.json');
  }

  /**
   * Metodo che invia al server il cliente modificato.
   * @param client Contiene i dati del cliente modificato
   * @param id ID del cliente modificato.
   */
  updateClientFromServer(client, id, token): Observable<Client> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.put<Client>(this.url_edit + id + '.json', client, this.http_options);
  }

  /**
   * Metodo che comunica al server l'eliminazione del cliente.
   * @param id ID del cliente eliminato.
   */
  deleteClientFromServer(id, token): Observable<Client> {
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    }
    return this.http.delete<Client>(this.url_delete + id + '.json', this.http_options);
  }
}
