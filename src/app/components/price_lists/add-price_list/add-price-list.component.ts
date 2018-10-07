import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PriceListsService } from '../../../services/price_lists/price-lists.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-add-price-list',
  templateUrl: './add-price-list.component.html',
  styleUrls: ['./add-price-list.component.scss']
})
/** Questo component si occupa della creazione di un singolo listino prezzi. */
export class AddPriceListComponent implements OnInit {

  private title: string = 'Nuovo Listino Prezzi';
  private token: any = "";
  private create_price_list_form: FormGroup;
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, 
    private priceListsService: PriceListsService,
    private authService: AuthenticationService, 
    private iDBService: IndexedDBService,
    private titleService: Title, 
    public snackbar: MatSnackBar
  ) {
    this.create_price_list_form = formBuilder.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
      scope: ["", Validators.required],
      type: ["1"],
      default_price_type: ["", Validators.required],
      notes: [""],
      valid_to: [""],
      valid_from: [""],
      description: [""],
      created: new Date(Date.now()),
      modified: new Date(Date.now())
    });
  }

  addPriceList(): void {
    this.loading = true;
    if (!navigator.onLine) {
      this.addPriceListToServerLater();
    }
    else {
      this.addPriceListToServer();
    }
    this.addPriceListToCollection();
  }

  /** Metodo che invia al server il listino prezzi creato. */
  addPriceListToServer(): void {
    this.priceListsService.addPriceListToServer(this.create_price_list_form.value, this.token)
      .subscribe(
        success => {
          this.loading = false;
          console.log(success);
          this.snackbar.open("Listino creato con successo!","", {
            duration: this.timer,
            panelClass: ['blue-snackbar']
          });
          this.router.navigate(['/price-lists']);
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
  }

  addPriceListToServerLater(): void {
    this.priceListsService.post_offline(this.create_price_list_form.value);
    this.loading = false;
  }

  /** Metodo che aggiunge il listino creato nel database locale. */
  addPriceListToCollection(): void {
    this.iDBService.addPriceListToCollection(this.create_price_list_form.value);
    if (!navigator.onLine) {
      this.snackbar.open("Listino creato con successo!","", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
      this.router.navigate(['/price-lists']);
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
  /** Getter del form del listino da aggiungere. */
  getPriceListForm(): FormGroup {
    return this.create_price_list_form;
  }

  ngOnInit() {
    this.titleService.setTitle("Nuovo Listino Prezzi | Mazapégul");
    if (navigator.onLine) this.checkToken();
  }

}
