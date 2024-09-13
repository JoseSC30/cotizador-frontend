import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { SharedModule } from '../shared/shared.module';
import { SettingPageComponent } from './pages/setting-page/setting-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalPaypalComponent } from './components/modal-paypal/modal-paypal.component';
import { NgxPayPalModule } from 'ngx-paypal';


@NgModule({
  declarations: [
    CustomerLayoutComponent,
    HomePageComponent,
    ChatsPageComponent,
    SettingPageComponent,
    ModalPaypalComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPayPalModule,
  ],
  exports: [
    ModalPaypalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule { }
