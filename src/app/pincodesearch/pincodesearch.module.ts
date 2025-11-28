import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PincodesearchPageRoutingModule } from './pincodesearch-routing.module';
import { PincodesearchPage } from './pincodesearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PincodesearchPageRoutingModule
  ],
  declarations: [PincodesearchPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PincodesearchPageModule {}