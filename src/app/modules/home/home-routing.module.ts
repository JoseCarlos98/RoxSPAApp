import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { AboutComponent } from './pages/about/about.component';
// import { ProductsComponent } from './pages/products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path:'products',
    component: ProductsComponent
  },
  {
    path:'about',
    component: AboutComponent
  },
  {
    path:'machines',
    component: MachinesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
