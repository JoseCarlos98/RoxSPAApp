import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SuccessComponent } from './pages/success/success.component';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [CheckoutComponent, SuccessComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxStripeModule.forRoot(environment.stripeKey),
    PipesModule,
    NgxPayPalModule,
  ],
})
export class CheckoutModule {}
