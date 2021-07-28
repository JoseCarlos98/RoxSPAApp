import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ModulesModule } from './modules/modules.module';
import { ImgPipe } from './shared/pipes/img.pipe';
import { PipesModule } from './shared/pipes/pipes.module';
import { ContactComponent } from './shared/components/contact/contact.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    ModulesModule,
    PipesModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
