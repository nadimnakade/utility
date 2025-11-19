import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmiPageRoutingModule } from './emi-routing.module';

import { EmiPage } from './emi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmiPageRoutingModule
  ],
  declarations: [EmiPage]
})
export class EmiPageModule {}
