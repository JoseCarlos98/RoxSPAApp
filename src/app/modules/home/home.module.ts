import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductModule } from 'src/app/shared/components/product/product.module';


@NgModule({
  declarations: [
    HomeComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ProductModule
  ]
})
export class HomeModule { }
