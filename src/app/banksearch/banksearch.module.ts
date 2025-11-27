import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { BanksearchPage } from './banksearch.page';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BanksearchPage
      }
    ])
  ],
  declarations: [BanksearchPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BanksearchPageModule { }
