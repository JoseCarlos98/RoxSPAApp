import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './modules/all-products/pages/all-products/all-products.component';
import { ProductDetailComponent } from './modules/all-products/pages/product-detail/product-detail.component';
import { AboutComponent } from './modules/home/pages/about/about.component';
import { ContactComponent } from './shared/components/contact/contact.component';
import { ContactModule } from './shared/components/contact/contact.module';
// pages/product-detail/product-detail.component

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/all-products/all-products.module').then(
        (m) => m.AllProductsModule
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./shared/components/contact/contact.module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./modules/services/services.module').then(
        (m) => m.ServicesModule
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./modules/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./modules/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
