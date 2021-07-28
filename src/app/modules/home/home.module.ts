import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductModule } from 'src/app/shared/components/product/product.module';
import { AboutComponent } from './pages/about/about.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { ContactModule } from 'src/app/shared/components/contact/contact.module';


@NgModule({
  declarations: [
    HomeComponent,
    ProductsComponent,
    AboutComponent,
    MachinesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductModule,
    ContactModule
  ]
})
export class HomeModule { }
