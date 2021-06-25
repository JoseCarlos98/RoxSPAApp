import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
