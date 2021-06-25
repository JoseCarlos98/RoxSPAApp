import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './pages/cart/cart.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CartModule {}
