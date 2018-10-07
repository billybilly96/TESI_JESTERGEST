import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PriceList } from '../../../classes/price-lists/price-list';
import { PriceListsService } from '../../../services/price_lists/price-lists.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-view-price-list',
  templateUrl: './view-price-list.component.html',
  styleUrls: ['./view-price-list.component.scss']
})
/** Questo component si occupa della visualizzazione di un singolo listino. */
export class ViewPriceListComponent implements OnInit {
  private title: string = 'Vedi Listino · Prezzi';
  private price_list: PriceList;
  private id: number = +this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute, 
    private priceListsService: PriceListsService,
    private iDBService: IndexedDBService,
    private titleService: Title
  ) {}

  getOnePriceListFromCollection(): void {
    this.iDBService.getPriceListByKey(this.id, (price_list => {
      price_list.created = new Intl.DateTimeFormat("it-IT").format(new Date(price_list.created));
      price_list.modified = new Intl.DateTimeFormat("it-IT").format(new Date(price_list.modified));
      price_list.scope = price_list.scope == 1 ? 'Ecommerce+Offline' : price_list.scope == 2 ? 'Ecommerce' : price_list.scope == 3 ? 'Offline' : "--";
      price_list.notes = price_list.notes == "" ? '--' : price_list.notes == null ? "--" : price_list.notes;
      price_list.description = price_list.description == "" ? '--' : price_list.description == null ? "--" : price_list.description;
      price_list.default_price_type = price_list.default_price_type == 1 ? 'Prezzo netto' : 'Prezzo lordo';
      if (price_list.scope == "--" || price_list.valid_to == null) {
        price_list.valid_from = "";
        price_list.valid_to = "";
      }         
      else {
        price_list.valid_from = new Intl.DateTimeFormat("it-IT").format(new Date(price_list.valid_from));
        price_list.valid_from = "da " + price_list.valid_from;
        price_list.valid_to = new Intl.DateTimeFormat("it-IT").format(new Date(price_list.valid_to));
        price_list.valid_to = "a " + price_list.valid_to;
      }
      this.price_list = price_list;
    }));
  }

  /** Getter del listino. */
  getPriceListData(): PriceList {
    return this.price_list;
  }

  /** Getter del titolo della pagina. */
  getPageTitle(): string {
    return this.title;
  }

  /** Getter dell'ID del listino. */
  getID(): number {
    return this.id;
  }

  ngOnInit() {
    this.titleService.setTitle("Vedi Listino Prezzi | Mazapégul");
    this.getOnePriceListFromCollection();
  }

}
