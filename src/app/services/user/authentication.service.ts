import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material";
import { User } from '../../classes/users/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url_login: string = "http://localhost/angular-jestergest-new/login.json";
  private url_token: string = "http://localhost/angular-jestergest-new/dashboard/csrf-token.json";
  private isUserLogged: boolean = false;
  private http_options = {};
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private http: HttpClient,
    public snackbar: MatSnackBar
  ) {}

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): Observable <any> {
    return this.http.get<any>(this.url_token, {
      withCredentials: true
    });
  }

  /** Metodo che controlla se l'utente si è autenticato correttamente. */
  checkIfUserIsLogged(): boolean {
    return this.isUserLogged;
  }

  /**
   * Metodo che invia al server i dati dell'autenticazione dell'utente e 
   * ne controlla la risposta.
   * @param user 
   */
  login(user, token): Observable<any> {
    console.log("Dati di autenticazione inviati al server...", user);
    this.http_options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    };
    this.loading = true;
    return this.http.post<any>(this.url_login, user, this.http_options).pipe(map(data => {
          console.log(data);
          if (data.data != null) {
            this.loading = false;
            this.isUserLogged = true;
            sessionStorage.setItem('currentUser', JSON.stringify(user.email));
            return user.email;
          } else {
            this.loading = false;
            this.snackbar.open("USERNAME O PASSWORD NON VALIDI!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          }
    }));
  }
}
