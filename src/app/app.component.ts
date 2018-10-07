import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { ProductsService } from './services/products/products.service';
import { ClientsService } from './services/clients/clients.service';
import { PriceListsService } from './services/price_lists/price-lists.service';
import { AuthenticationService } from './services/user/authentication.service';
import { IndexedDBService } from "./services/db/indexed-db.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private isOnline: boolean = false;
  private timer: number = 3000;
  private token: any = "";
  private update: boolean = false;
  private post_product = [];
  private post_client = [];
  private post_price_list = [];
  private put_product = [];
  private put_client = [];
  private put_price_list = [];
  private delete_product = [];
  private delete_client = [];
  private delete_price_list = [];

  constructor(
    public swUpdate: SwUpdate,
    public snackbar: MatSnackBar,
    private productService: ProductsService,
    private clientService: ClientsService,
    private priceListsService: PriceListsService,
    private authService: AuthenticationService,
    private iDBService: IndexedDBService,
    private router: Router
  ) {}

  /** Controlla se ci sono aggiornamenti. */
  checkForUpdate(): void {
    if (navigator.onLine && this.update == true) {
      setTimeout(()=> {
        const snack = this.snackbar.open("È disponibile un aggiornamento!", "Aggiorna");
        snack.onAction().subscribe(() => {
          this.getDataFromServer();
          this.router.navigate(['/dashboard']);
        });
      }, 2000);
      this.update = false;
    }
  }
  /** Controlla se la connessione è presente o meno. */
  checkNetwork(): void {
    var self = this;
    if (navigator.onLine && self.isOnline == false) {
      self.isOnline = true;
      self.snackbar.open("Connessione internet presente. Buon lavoro da Jestergest!", "", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
    } else if (!navigator.onLine == self.isOnline == true) {
      self.isOnline = false;
      self.snackbar.open("Connessione internet assente. Stai lavorando in modalità offline!", "", {
        duration: this.timer,
        panelClass: ['blue-snackbar']
      });
    }
  }

  checkRequestToSend(): void {
    if (navigator.onLine && (localStorage.getItem("post_product") != null ||
     localStorage.getItem("post_client") != null ||
     localStorage.getItem("put_product") != null ||
     localStorage.getItem("put_client") != null ||
     localStorage.getItem("delete_product") != null ||
     localStorage.getItem("delete_client") != null)) {
      if (localStorage.getItem("post_product") != null) {
        this.post_product = JSON.parse(localStorage.getItem("post_product"));
        localStorage.removeItem("post_product");
        this.post_product.forEach(element => {
          this.productService.addProductToServer(element, this.token).subscribe(() => {
            this.snackbar.open("Il Prodotto creato è stato sincronizzato con il server!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          });          
        });
        this.update = true;        
      }
      if (localStorage.getItem("post_client") != null) {
        this.post_client = JSON.parse(localStorage.getItem("post_client"));
        localStorage.removeItem("post_client");
        this.post_client.forEach(element => {
          this.clientService.addClientToServer(element, this.token).subscribe(() => {
            this.snackbar.open("Il Cliente aggiunto è stato sincronizzato con il server!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          }); 
        });
        this.update = true;  
      }
      if (localStorage.getItem("put_product") != null) {
        this.put_product = JSON.parse(localStorage.getItem("put_product"));
        localStorage.removeItem("put_product");
        this.put_product.forEach(element => {
          this.productService.updateProductFromServer(JSON.parse(element), JSON.parse(element).id, this.token).subscribe(() => {         
            this.snackbar.open("Il Prodotto modificato è stato sincronizzato con il server!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          });
          this.update = true; 
        });   
      }  
      if (localStorage.getItem("put_client") != null) {
        this.put_client = JSON.parse(localStorage.getItem("put_client"));
        localStorage.removeItem("put_client");
        this.put_client.forEach(element => {
          this.clientService.updateClientFromServer(JSON.parse(element), JSON.parse(element).id, this.token).subscribe(() => {
            this.snackbar.open("Il Cliente modificato è stato sincronizzato con il server!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          });
        });
        this.update = true;  
      }
      if (localStorage.getItem("delete_product") != null) {
        this.delete_product = JSON.parse(localStorage.getItem("delete_product"));
        localStorage.removeItem("delete_product");
        console.log("Remove client rimosso");
        this.delete_product.forEach(element => {
          this.productService.deleteProductFromServer(element, this.token).subscribe(() => {
            this.snackbar.open("Il Prodotto eliminato è stato sincronizzato con il server!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          });
        });
        this.update = true;  
      }
      if (localStorage.getItem("delete_client") != null) {
        this.delete_client = JSON.parse(localStorage.getItem("delete_client"));
        localStorage.removeItem("delete_client");
        this.delete_client.forEach(element => {
          this.clientService.deleteClientFromServer(element, this.token).subscribe(() => {
            this.snackbar.open("Il Prodotto eliminato è stato sincronizzato con il server!","", {
              duration: this.timer,
              panelClass: ['blue-snackbar']
            });
          });
        });
        this.update = true;  
      }
    }
  }

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      this.token = token.csrfToken;
    });
  }

  getDataFromServer(): void {
    this.getProductsFromServerAndFillTheCollection();
    this.getClientsFromServerAndFillTheCollection();
    this.getPriceListsFromServerAndFillTheCollection();
  }

  getProductsFromServerAndFillTheCollection(): void {
    this.productService.getProductsFromServer().subscribe(data => {
      data['products'].forEach(product => {
        this.iDBService.addProductToCollection(product);
      });
    });
  }

  getClientsFromServerAndFillTheCollection(): void {
    this.clientService.getClientsFromServer().subscribe(data => {
      data['clients'].forEach(client => {
        this.iDBService.addClientToCollection(client);
      });
    });
  }

  getPriceListsFromServerAndFillTheCollection(): void {
    this.priceListsService.getPriceListsFromServer().subscribe(data => {
      data['priceLists'].forEach(priceList => {
        this.iDBService.addPriceListToCollection(priceList);
      });
    });
  }

  getToken(): string {
    return this.token;
  }

  clearCollections(): void {
    this.iDBService.clearAllProducts();
    this.iDBService.clearAllClients();
    this.iDBService.clearAllPriceLists();
  }

  ngOnInit() {
    if (this.iDBService.isFirstAccess()) {
      console.log("Primo accesso");
      this.clearCollections();
      this.getDataFromServer();
    }
    this.checkToken();
    setInterval(()=> {
      this.checkNetwork();
      this.checkRequestToSend();
      this.checkForUpdate();
    }, this.timer);
  }

}
