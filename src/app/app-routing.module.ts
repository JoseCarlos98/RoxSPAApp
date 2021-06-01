import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './modules/all-products/pages/all-products/all-products.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'checkout',
    loadChildren: () =>
    import('./modules/checkout/checkout.module').then((m) => m.CheckoutModule),

  },
  {
    path: 'products',
    loadChildren: () =>
    import('./modules/all-products/all-products.module').then((m) => m.AllProductsModule),

  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
