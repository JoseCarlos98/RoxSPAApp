import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [ProductComponent],
  imports: [CommonModule, PipesModule],
  exports: [ProductComponent],
})
export class ProductModule {}
