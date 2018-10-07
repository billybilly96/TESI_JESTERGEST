import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url_login: string = "http://localhost/angular-jestergest-new/login.json";
  private url_token: string = "http://localhost/angular-jestergest-new/dashboard/csrf-token.json";
  private isUserLogged: boolean = false;
  private HTTP_OPTIONS = {};

  constructor(
    private http: HttpClient
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
    console.log("Dati di autenticazione inviati al server...")
    this.HTTP_OPTIONS = {
      // 'Content-Type': 'application/x-www-form-urlencoded'
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': token }),
      withCredentials: true
    };
    return this.http.post<any>(this.url_login, user, this.HTTP_OPTIONS).pipe(map(data => {
          console.log("Ai sem?")
          console.log(data);
          if (data.authUser != null) {
            this.isUserLogged = true;
            sessionStorage.setItem('currentUser', JSON.stringify(user.email));
            return user.email;
        }
    }));
  }
}
