import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceList } from '../../../classes/price-lists/price-list';
import { PriceListsService } from '../../../services/price_lists/price-lists.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-edit-price-list',
  templateUrl: './edit-price-list.component.html',
  styleUrls: ['./edit-price-list.component.scss']
})
/** Questo component si occupa della modifica di un singolo listino. */
export class EditPriceListComponent implements OnInit {
  private title: string = 'Modifica Listino Prezzi';
  @Input() price_list: PriceList;
  private update_price_list_form: FormGroup;
  private id: number = +this.route.snapshot.paramMap.get('id');
  private token: any = "";
  private loading: boolean = false;
  private timer: number = 6000;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private priceListsService: PriceListsService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private iDBService: IndexedDBService,
    private titleService: Title, 
    public snackbar: MatSnackBar
  ) {
    this.update_price_list_form = this.formBuilder.group({
      id: [this.id],
      code: ["", Validators.required],
      name: ["", Validators.required],
      scope: ["", Validators.required],
      type: ["1"],
      default_price_type: ["", Validators.required],
      notes: [""],
      valid_to: [""],
      valid_from: [""],
      description: [""],
      created: [],
      modified: new Date(Date.now())
    });
  }

  updatePriceList(): void {
    this.loading = true;
    if (!navigator.onLine) {
      this.updatePriceListFromServerLater();
    }
    else {
      this.updatePriceListFromServer();
    }
    this.updatePriceListFromCollection();
  }

  /** Metodo che invia al server il listino modificato. */
  updatePriceListFromServer(): void {
    this.priceListsService.updatePriceListFromServer(this.update_price_list_form.value, this.update_price_list_form.value.id, this.token)
      .subscribe( 
        success => {
          console.log(success);
          this.loading = false;
          this.snackbar.open("Listino modificato con successo!","", {
            duration: this.timer,
            panelClass: ['blue-snackbar']
          });
          this.router.navigate(['/price-lists/view/' + this.update_price_list_form.value.id]);
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
  }

  updatePriceListFromServerLater(): void {
    this.priceListsService.put_offline(this.update_price_list_form.value);
    this.loading = false;
  }

  /** Metodo che aggiorna il listino nel database locale con le nuove modifiche. */
  updatePriceListFromCollection(): void {
    this.iDBService.editPriceList(this.update_price_list_form.value);
    if (!navigator.onLine) {
      this.snackbar.open("Listino modificato con successo!","", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
      this.router.navigate(['/price-lists/view/' + this.update_price_list_form.value.id]);
    }
  }

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      this.token = token.csrfToken;
    });
  }

  /** Prende il listino selezionato dal db locale e popola il form. */
  getOnePriceListFromCollectionAndFillTheForm(): void {
    this.iDBService.getPriceListByKey(this.id, price_list => {
      this.price_list = price_list;
      this.update_price_list_form.patchValue({
        code: price_list.code,
        name: price_list.name,
        description: price_list.description,
        notes: price_list.notes,
        scope: price_list.scope,
        default_price_type: price_list.default_price_type,
        type: price_list.type,
        valid_from: price_list.valid_from,
        valid_to: price_list.valid_to
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
  /** Getter del form del listino. */
  getPriceListForm(): FormGroup {
    return this.update_price_list_form;
  }

  ngOnInit() {
    this.titleService.setTitle("Modifica Listino Prezzi | Mazapégul");
    this.getOnePriceListFromCollectionAndFillTheForm();
    if (navigator.onLine) this.checkToken();
  }

}
