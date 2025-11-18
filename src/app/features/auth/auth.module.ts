import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormImportsModule } from 'src/app/shared/forms/form-imports.module'

import { ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from "@angular/cdk/a11y";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule,
    A11yModule
]
})
export class AuthModule { }
