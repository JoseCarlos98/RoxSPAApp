import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductsRoutingModule } from './all-products-routing.module';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SwiperModule } from 'swiper/angular';
import { ProductModule } from 'src/app/shared/components/product/product.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [AllProductsComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    AllProductsRoutingModule,
    SwiperModule,
    ProductModule,
    PipesModule,
    QuillModule.forRoot(),
  ],
})
export class AllProductsModule {}
