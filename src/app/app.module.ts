import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { authInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutComponent,
    MatSnackBarModule,
    MatNativeDateModule,
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    { provide: MAT_DATE_LOCALE, useValue: 'es-BO' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
