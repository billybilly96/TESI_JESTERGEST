import { Injectable } from '@angular/core';
import { AngularIndexedDB } from 'angular2-indexeddb';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/** Questo servizio ha il compito di contenere la logica della gestione
 * del database locale e di comunicare con i vari components. 
 */
export class IndexedDBService {
  private db: AngularIndexedDB = new AngularIndexedDB('myDb', 1);
  private dbCreatePromise: any;
  private firstAccess: boolean = true;
  private getDataFromServer: boolean = true;

  constructor() {
    this.dbCreatePromise = this.db.openDatabase(1, (evt) => {
      var productsStore = evt.currentTarget.result.createObjectStore(
        'products', { keyPath: "id", autoIncrement: true });
      var clientsStore = evt.currentTarget.result.createObjectStore(
        'clients', { keyPath: "id", autoIncrement: true });
      var priceListsStore = evt.currentTarget.result.createObjectStore(
        'price_lists', { keyPath: "id", autoIncrement: true });       
    }); 
  }


  /**
   * Invia al database locale un nuovo prodotto.
   * @param product Dati del prodotto da aggiungere alla collezione.
   */
  addProductToCollection(product): void {
    this.db.add('products', product).then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Invia al database locale un nuovo cliente.
   * @param client Dati del cliente da aggiungere alla collezione.
   */
  addClientToCollection(client): void {
    this.db.add('clients', client).then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Invia al database locale un nuovo listino.
   * @param price_list Dati del listino da aggiungere alla collezione.
   */
  addPriceListToCollection(price_list): void {
    this.db.add('price_lists', price_list).then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Prende dal database locale un prodotto con un determinato ID.
   * @param product_id ID del prodotto da prendere dalla collezione.
   * @param callback Dati del prodotto richiesto.
   */
  getProductByKey(product_id, callback): void {
    this.db.openDatabase(1).then(() => {
      this.dbCreatePromise.then((callback => {
        this.db.getByKey('products', product_id).then(product => {
          callback(product);
        }, (error) => {
          console.log(error);
        });
      })(callback));
    });
  }

  /**
   * Prende dal database locale un cliente con un determinato ID.
   * @param client_id ID del cliente da prendere dalla collezione.
   * @param callback Dati del cliente richiesto.
   */
  getClientByKey(client_id, callback): void {
    this.db.openDatabase(1).then(() => {
      this.dbCreatePromise.then((callback => {
        this.db.getByKey('clients', client_id).then(client => {
          callback(client);
        }, (error) => {
          console.log(error);
        });
      })(callback));
    });
  }

  /**
   * Prende dal database locale un listino con un determinato ID.
   * @param price_list_id ID del listino da prendere dalla collezione.
   * @param callback Dati del listino richiesto.
   */
  getPriceListByKey(price_list_id, callback): void {
    this.db.openDatabase(1).then(() => {
      this.dbCreatePromise.then((callback => {
        this.db.getByKey('price_lists', price_list_id).then(price_list => {
          callback(price_list);
        }, (error) => {
          console.log(error);
        });
      })(callback));
    });
  }

  /**
   * Prende dal database locale tutti i prodotti.
   * @param callback Dati di tutti i prodotti richiesti.
   */
  getAllProducts(callback): void {
    this.db.openDatabase(1).then(() => {
      this.db.getAll('products').then(products => {
        callback(products);
      }, (error) => {
        console.log(error);
      });
    });
  }

  /**
   * Prende dal database locale tutti i clienti.
   * @param callback Dati di tutti i clienti richiesti.
   */
  getAllClients(callback): void {
    this.db.openDatabase(1).then(() => {
      this.db.getAll('clients').then(clients => {
        callback(clients);
      }, (error) => {
        console.log(error);
      });
    });
  }

  /**
   * Prende dal database locale tutti i listini.
   * @param callback Dati di tutti i listini richiesti.
   */
  getAllPriceLists(callback): void {
    this.db.openDatabase(1).then(() => {
      this.db.getAll('price_lists').then(price_lists => {
        callback(price_lists);
      }, (error) => {
        console.log(error);
      });
    });
  }

  /**
   * Aggiorna nel database locale il prodotto modificato. 
   * @param product Dati del prodotto modificato.
   */
  editProduct(product): void {
    this.db.update('products', product).then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Aggiorna nel database locale il cliente modificato. 
   * @param client Dati del cliente modificato.
   */
  editClient(client): void {
    this.db.update('clients', client).then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Aggiorna nel database locale il listino modificato. 
   * @param price_list Dati del listino modificato.
   */
  editPriceList(price_list): void {
    this.db.update('price_lists', price_list).then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Elimina dal database locale un prodotto. 
   * @param id ID del prodotto da eliminare.
   */
  removeProduct(id): void {
    this.db.delete('products', id).then(() => { 
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Elimina dal database locale un cliente. 
   * @param id ID del cliente da eliminare.
   */
  removeClient(id): void {
    this.db.delete('clients', id).then(() => { 
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Elimina dal database locale un listino. 
   * @param id ID del listino da eliminare.
   */
  removePriceList(id): void {
    this.db.delete('price_lists', id).then(() => { 
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Elimina dal database locale tutti i prodotti. 
   */
  clearAllProducts(): void {
    this.db.openDatabase(1).then(() => {
      this.db.clear('products').then(() => {  
      }, (error) => {
        console.log(error);
      });
    });
  }

  /**
   * Elimina dal database locale tutti i clienti. 
   */
  clearAllClients(): void {
    this.db.openDatabase(1).then(() => {
      this.db.clear('clients').then(() => {
      }, (error) => {
        console.log(error);
      });
    });
  }

  /**
   * Elimina dal database locale tutti i listini. 
   */
  clearAllPriceLists(): void {
    this.db.openDatabase(1).then(() => {
      this.db.clear('price_lists').then(() => {
      }, (error) => {
        console.log(error);
      });
    });
  }

   /**
   * Controlla se si è verificato il primo accesso all'interno dell'applicazione. 
   */
  isFirstAccess(): boolean {
    this.firstAccess ? this.getDataFromServer = true : this.getDataFromServer = false;
    this.firstAccess = false;
    return this.getDataFromServer;
  }
}
