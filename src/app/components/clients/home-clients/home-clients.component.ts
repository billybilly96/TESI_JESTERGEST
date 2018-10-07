import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Client } from '../../../classes/clients/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';
import { Title } from "@angular/platform-browser";
import { MatDialog, MatDialogRef } from '@angular/material'; 
import { MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../../services/user/authentication.service';
import { Router } from '@angular/router';

var id_delete;
var my_token: any = "";

@Component({
  selector: 'app-home-clients',
  templateUrl: './home-clients.component.html',
  styleUrls: ['./home-clients.component.scss']
})
export class HomeClientsComponent implements OnInit {
  private title: string = 'Clienti';
  private clients: Client[];
  private displayedColumns: string[] = ['code', 'name', 'referent', 'contacts_count', 'address_count', 'actions'];
  private dataSource: MatTableDataSource<Client>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private clientService: ClientsService, 
    private titleService: Title,
    private iDBService: IndexedDBService,
    public dialog: MatDialog,
    private authService: AuthenticationService
  ) {}

  openDialog(id): void {
    id_delete = id;
    const dialogRef = this.dialog.open(DialogClientDelete, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  /**
   * Metodo che applica la tipologia di filtraggio all'interno della tabella.
   * @param filterValue La stringa da cercare all'interno della mia tabella.
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }
  /** Scarica tutti i clienti dal server. */
  getClientsFromServer(): void {
    this.clientService.getClientsFromServer()
      .subscribe(data => {
        this.clients = data['clients'];
        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  /** Scarica i clienti dalla collection locale. */
  getClientsFromCollection(): void {
    this.iDBService.getAllClients(clients => {
      this.clients = clients;
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Getter dei clienti */
  getClientsArray(): Client[] {
    return this.clients;
  }
  /** Getter del displayedColums */
  getDisplayedColumns(): String[] {
    return this.displayedColumns;
  }
  /** Getter del dataSource */
  getDataSource(): any {
    return this.dataSource;
  }
  /** Getter del titolo della pagina */
  getPageTitle(): String {
    return this.title;
  }

  /** Metodo che scarica il csrf-token prodotto dal server per la corretta autenticazione. */
  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      my_token = token.csrfToken;
    });
  }

  ngOnInit() {
    if (navigator.onLine) this.checkToken();
    this.titleService.setTitle("Clienti | Mazapégul");
    this.getClientsFromCollection();
  }

}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogClientDelete {

  constructor(
    public dialogRef: MatDialogRef<DialogClientDelete>,
    private clientService: ClientsService,
    private iDBService: IndexedDBService,
    public snackbar: MatSnackBar,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteClient(): void {
    if (!navigator.onLine) {
      this.deleteClientFromServerLater();
    }
    else {
      this.deleteClientFromServer();
    }
    this.deleteClientFromCollection();
  }

  deleteClientFromServerLater(): void {
    this.clientService.delete_offline(id_delete);
  }

  deleteClientFromServer(): void {
    this.clientService.deleteClientFromServer(id_delete, my_token)
      .subscribe(
        client => { console.log("Eliminazione del cliente", client, "avvenuta con successo"); },
        error => console.log(error)
      );
  }

  getClientID(): number {
    return id_delete;
  }

  deleteClientFromCollection(): void {
    this.iDBService.removeClient(id_delete);
    setTimeout(()=> {
      this.snackbar.open("Cliente eliminato con successo!","", {
        duration: 5000,
        panelClass: ['blue-snackbar']
      });
      this.onNoClick();
      this.router.navigateByUrl('/dashboard');
    },3000);
  }

}
