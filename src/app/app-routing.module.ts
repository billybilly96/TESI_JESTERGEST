import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeClientsComponent } from './components/clients/home-clients/home-clients.component';
import { ViewClientComponent } from './components/clients/view-client/view-client.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { HomeProductsComponent } from './components/products/home-products/home-products.component';
import { ViewProductComponent } from './components/products/view-product/view-product.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { LoginUsersComponent } from './components/users/login-users/login-users.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PriceListsComponent } from './components/price_lists/home-price_lists/price-lists.component';
import { AddPriceListComponent } from './components/price_lists/add-price_list/add-price-list.component';
import { ViewPriceListComponent } from './components/price_lists/view-price-list/view-price-list.component';
import { EditPriceListComponent } from './components/price_lists/edit-price-list/edit-price-list.component';
import { AuthGuard } from './utilities/auth-guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginUsersComponent },
  { path: 'clients', component: HomeClientsComponent, canActivate: [AuthGuard] },
  { path: 'clients/view/:id', component: ViewClientComponent, canActivate: [AuthGuard] },
  { path: 'clients/add', component: AddClientComponent, canActivate: [AuthGuard] },
  { path: 'clients/edit/:id', component: EditClientComponent, canActivate: [AuthGuard] },
  { path: 'products', component: HomeProductsComponent, canActivate: [AuthGuard] },
  { path: 'products/view/:id', component: ViewProductComponent, canActivate: [AuthGuard] },
  { path: 'products/add', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'products/edit/:id', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: 'price-lists', component: PriceListsComponent, canActivate: [AuthGuard] },
  { path: 'price-lists/add', component: AddPriceListComponent, canActivate: [AuthGuard] },
  { path: 'price-lists/view/:id', component: ViewPriceListComponent, canActivate: [AuthGuard] },
  { path: 'price-lists/edit/:id', component: EditPriceListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
