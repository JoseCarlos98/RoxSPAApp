import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductsRoutingModule } from './all-products-routing.module';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SwiperModule } from 'swiper/angular';
import { ProductModule } from 'src/app/shared/components/product/product.module';
import { CarComponent } from './pages/car/car.component';

@NgModule({
  declarations: [AllProductsComponent, ProductDetailComponent, CarComponent],
  imports: [
    CommonModule,
    AllProductsRoutingModule,
    SwiperModule,
    ProductModule,
  ],
})
export class AllProductsModule {}
