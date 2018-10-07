import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ClientsService } from '../../../services/clients/clients.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
/** Questo component si occupa dell'aggiunta di un singolo cliente. */
export class AddClientComponent implements OnInit {
  private title: string = 'Nuovo Cliente';
  private token: any = "";
  private create_client_form: FormGroup;
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, 
    private clientsService: ClientsService,
    private authService: AuthenticationService, 
    private iDBService: IndexedDBService,
    private titleService: Title, 
    public snackbar: MatSnackBar
  ) {
    this.create_client_form = formBuilder.group({
      code: ["", Validators.required],
      type: ["", Validators.required],
      status: [""],
      aka: [""],
      company_name: [""],
      description: [""],
      notes: [""],
      codice_fiscale: [""],
      birthday: [""],
      referent: [""],
      first_name: [""],
      last_name: [""],
      partita_iva: [""],
      created: new Date(Date.now()),
      modified: new Date(Date.now()),
    });
  }

  /**  Metodo che chiama altri metodi utili all'aggiunta di un nuovo cliente. */
  addClient(): void {
    this.loading = true;
    if (!navigator.onLine) {
      this.addClientToServerLater();
    }
    else {
      this.addClientToServer();
    }
    this.addClientToCollection();
  }

  addClientToServerLater(): void {
    this.clientsService.post_offline(this.create_client_form.value);
    this.loading = false;
  }

  /** Metodo che invia al server il cliente creato. */
  addClientToServer(): void {
    this.clientsService.addClientToServer(this.create_client_form.value, this.token)
      .subscribe(
        success => {
          this.loading = false;
          console.log(success);
          this.snackbar.open("Cliente creato con successo!","", {
            duration: this.timer,
            panelClass: ['blue-snackbar']
          });
          this.router.navigate(['/clients']);
        },
        error => {
          this.loading = false;
            console.log(error);
        }
      );
  }

  /** Metodo che aggiunge il cliente creato nel database locale. */
  addClientToCollection(): void {
    this.iDBService.addClientToCollection(this.create_client_form.value);
    if (!navigator.onLine) {
      this.snackbar.open("Cliente creato con successo!","", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
      this.router.navigate(['/clients']);
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
  /** Getter del form del cliente. */
  getClientForm(): FormGroup {
    return this.create_client_form;
  }

  ngOnInit() {
    this.titleService.setTitle("Nuovo Cliente | Mazapégul");
    if (navigator.onLine) this.checkToken();
  }

}
