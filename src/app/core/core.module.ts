import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [],
  imports: [CommonModule, FooterModule, HeaderModule, HttpClientModule],
  exports: [FooterModule, HeaderModule],
})
export class CoreModule {}
