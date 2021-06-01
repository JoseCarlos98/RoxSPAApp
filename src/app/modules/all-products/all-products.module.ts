import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductsRoutingModule } from './all-products-routing.module';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';


@NgModule({
  declarations: [
    AllProductsComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    AllProductsRoutingModule
  ]
})
export class AllProductsModule { }
