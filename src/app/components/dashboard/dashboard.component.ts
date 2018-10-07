import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { IndexedDBService } from "../../services/db/indexed-db.service";
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private title: string = 'Dashboard';

  constructor(
    private titleService: Title,
    private iDBService: IndexedDBService
  ) {}

  getPageTitle(): string {
    return this.title;
  }

  ngOnInit() {
    this.titleService.setTitle("Dashboard | Mazapégul");
  }

}
