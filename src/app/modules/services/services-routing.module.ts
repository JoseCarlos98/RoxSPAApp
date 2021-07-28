import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasComponent } from './pages/areas/areas.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { ServicesComponent } from './pages/services/services.component';

const routes: Routes = [
  {
    path: ':area',
    component: ServicesComponent,
  },
  {
    path: 'detail/:id',
    component: ServiceDetailComponent,
  },
  {
    path: '',
    component: AreasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}
