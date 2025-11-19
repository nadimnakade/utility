import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanycategoryPageRoutingModule } from './companycategory-routing.module';

import { CompanycategoryPage } from './companycategory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanycategoryPageRoutingModule
  ],
  declarations: [CompanycategoryPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CompanycategoryPageModule {}
