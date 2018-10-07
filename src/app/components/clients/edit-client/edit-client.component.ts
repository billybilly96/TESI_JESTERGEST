import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../classes/clients/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
  private title: string = 'Modifica Cliente';
  @Input() client: Client;
  private update_client_form: FormGroup;
  private id: number = +this.route.snapshot.paramMap.get('id');
  private token: any = "";
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private clientsService: ClientsService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private iDBService: IndexedDBService,
    private titleService: Title, 
    public snackbar: MatSnackBar
  ) {
    this.update_client_form = this.formBuilder.group({
      id: [this.id],
      code: ["", Validators.required],
      type: ["", Validators.required],
      status: [""],
      aka: [""],
      company_name: [""],
      description: [""],
      notes: [""],
      codice_fiscale: [""],
      first_name: [""],
      last_name: [""],
      created: [],
      modified: new Date(Date.now())
    });
  }

  updateClient(): void {
    this.loading = true;
    if (!navigator.onLine) {
      this.updateClientFromServerLater();
    }
    else {
      this.updateClientFromServer();
    }
    this.updateClientFromCollection();
  }

  updateClientFromServerLater(): void {
    this.clientsService.put_offline(this.update_client_form.value);
    this.loading = false;
  }

  /** Metodo che invia al server il cliente/azienda modificato. */
  updateClientFromServer(): void {
    this.clientsService.updateClientFromServer(this.update_client_form.value, this.update_client_form.value.id, this.token)
      .subscribe( 
        success => {
          this.loading = false;
          console.log(success);
          this.snackbar.open("Cliente modificato con successo!","", {
            duration: this.timer,
            panelClass: ['blue-snackbar']
          });
          this.router.navigate(['/clients/view/' + this.update_client_form.value.id]);
        },
        error => {
          this.loading = false;
            console.log(error);
        }
      );
  }

  /** Metodo che aggiorna il cliente nel database locale con le nuove modifiche. */
  updateClientFromCollection(): void {
    this.iDBService.editClient(this.update_client_form.value);
    if (!navigator.onLine) {
      this.snackbar.open("Cliente modificato con successo!","", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
      this.router.navigate(['/clients/view/' + this.update_client_form.value.id]);
    }
  }

  /** Prende il cliente/azienda selezionato dal db locale e popola il form. */
  getOneClientFromCollectionAndFillTheForm(): void {
    this.iDBService.getClientByKey(this.id, client => {
      this.client = client;
      this.update_client_form.patchValue({
        code: client.code,
        type: client.type,
        status: client.status,
        aka: client.aka,
        company_name: client.company_name,
        description: client.description,
        notes: client.notes,
        first_name: client.first_name,
        last_name: client.last_name,
        codice_fiscale: client.codice_fiscale
      });
    });      
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
    return this.update_client_form;
  }

  ngOnInit() {
    this.titleService.setTitle("Modifica Cliente");
    this.getOneClientFromCollectionAndFillTheForm(); 
    if (navigator.onLine) this.checkToken();
  }

}
