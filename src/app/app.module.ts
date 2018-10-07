import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeProductsComponent } from './components/products/home-products/home-products.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeClientsComponent } from './components/clients/home-clients/home-clients.component';
import { ViewProductComponent } from './components/products/view-product/view-product.component';
import { ViewClientComponent } from './components/clients/view-client/view-client.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { LoginUsersComponent } from './components/users/login-users/login-users.component';
import { DialogProductDelete } from './components/products/home-products/home-products.component';
import { DialogClientDelete } from './components/clients/home-clients/home-clients.component';
import { DialogPriceListDelete } from './components/price_lists/home-price_lists/price-lists.component';
import { PriceListsComponent } from './components/price_lists/home-price_lists/price-lists.component';
import { AddPriceListComponent } from './components/price_lists/add-price_list/add-price-list.component';
import { ViewPriceListComponent } from './components/price_lists/view-price-list/view-price-list.component';
import { EditPriceListComponent } from './components/price_lists/edit-price-list/edit-price-list.component';
import { ClientsService } from './services/clients/clients.service';
import { ProductsService } from './services/products/products.service';
import { PriceListsService } from './services/price_lists/price-lists.service';
import { IndexedDBService } from './services/db/indexed-db.service';
import { AuthenticationService } from './services/user/authentication.service';
import { FacadeService } from './services/FacadeService/facade.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeProductsComponent,
    NavbarComponent,
    DashboardComponent,
    HomeClientsComponent,
    ViewProductComponent,
    ViewClientComponent,
    AddProductComponent,
    AddClientComponent,
    EditProductComponent,
    EditClientComponent,
    LoginUsersComponent,
    DialogProductDelete,
    DialogClientDelete,
    PriceListsComponent,
    DialogPriceListDelete,
    AddPriceListComponent,
    ViewPriceListComponent,
    EditPriceListComponent
  ],
  entryComponents: [DialogProductDelete, DialogClientDelete, DialogPriceListDelete],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [
    ClientsService,
    ProductsService,
    PriceListsService,
    IndexedDBService,
    AuthenticationService,
    FacadeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
