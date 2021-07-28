import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { ProductModule } from 'src/app/shared/components/product/product.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { QuillModule } from 'ngx-quill';
import { ContactModule } from 'src/app/shared/components/contact/contact.module';
import { AreasComponent } from './pages/areas/areas.component';

@NgModule({
  declarations: [ServicesComponent, ServiceDetailComponent, AreasComponent],
  imports: [CommonModule, ServicesRoutingModule, ProductModule, PipesModule, QuillModule.forRoot(), ContactModule],
})
export class ServicesModule {}
