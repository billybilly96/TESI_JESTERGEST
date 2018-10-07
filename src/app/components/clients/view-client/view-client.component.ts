import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../classes/clients/client';
import { ClientsService } from '../../../services/clients/clients.service';
import { IndexedDBService } from '../../../services/db/indexed-db.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {
  private title: string = 'Vedi Cliente';
  private client: Client;
  private id: number = +this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute, 
    private clientsService: ClientsService,
    private iDBService: IndexedDBService
  ) {}

  /** Scarica un cliente/azienda dal server avente un determinato ID. */
  getOneClientFromServer(): void {
    this.clientsService.getOneClientFromServer(this.id).subscribe(data => {
      data['client'].birthday = new Intl.DateTimeFormat("it-IT").format(new Date(data['client'].birthday));
      data['client'].created = new Intl.DateTimeFormat("it-IT").format(new Date(data['client'].created));
      data['client'].modified = new Intl.DateTimeFormat("it-IT").format(new Date(data['client'].modified));
      data['client'].status = data['client'].status == 0 ? 'Non attivo' : 'Attivo';
      data['client'].type = data['client'].type == 1 ? 'Azienda' : 'Persona Fisica';
      this.client = data['client'];
    });
  }

  getOneClientFromCollection(): void {
    this.iDBService.getClientByKey(this.id, (client => {
      client.created = new Intl.DateTimeFormat("it-IT").format(new Date(client.created));
      client.modified = new Intl.DateTimeFormat("it-IT").format(new Date(client.modified));
      client.birthday = client.birthday == (null) ? "--" : new Intl.DateTimeFormat("it-IT").format(new Date(client.birthday));
      client.status = client.status == 1 ? 'Attivo' : 'Non attivo';
      client.type = client.type == 1 ? 'Azienda' : 'Persona Fisica';
      client.aka = client.aka == (null || "") ? '--' : client.aka;
      client.codice_fiscale = client.codice_fiscale == (null || "") ? '--' : client.codice_fiscale;
      client.notes = client.notes == (null || "") ? '--' : client.notes;
      client.referent = client.referent == (null) ? '--' : client.referent;
      this.client = client;
    }));
  }

  /** Getter del cliente/azienda. */
  getClientData(): Client {
    return this.client;
  }

  /** Getter del titolo della pagina. */
  getPageTitle(): string {
    return this.title;
  }

  /** Getter dell'ID del cliente/azienda. */
  getID(): number {
    return this.id;
  }

  ngOnInit() {
    this.getOneClientFromCollection();
  }

}
