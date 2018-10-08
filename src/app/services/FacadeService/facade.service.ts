import { Injectable, Injector } from '@angular/core';
import { ProductsService } from '../products/products.service';
import { ClientsService } from '../clients/clients.service';
import { PriceListsService } from '../price_lists/price-lists.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  private _productsService: ProductsService;
  public get productsService(): ProductsService {
    if(!this._productsService){
      this._productsService = this.injector.get(ProductsService);
    }
    return this._productsService;
  }

  private _clientsService: ClientsService;
  public get clientsService(): ClientsService {
    if(!this._clientsService){
      this._clientsService = this.injector.get(ClientsService);
    }
    return this._clientsService;
  }

  private _priceListsService: PriceListsService;
  public get priceListsService(): PriceListsService {
    if(!this._priceListsService){
      this._priceListsService = this.injector.get(PriceListsService);
    }
    return this._priceListsService;
  }

  constructor(private injector: Injector) {}
}
