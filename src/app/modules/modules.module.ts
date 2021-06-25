import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllProductsModule } from './all-products/all-products.module';
import { HomeModule } from './home/home.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PipesModule } from '../shared/pipes/pipes.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeModule,
    AllProductsModule,
    CartModule,
    CheckoutModule,
  ],
  exports: [
    HomeModule,
    AllProductsModule,
    CartModule,
    CheckoutModule,
    PipesModule
  ],
})
export class ModulesModule {}
