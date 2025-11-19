import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgxWheelModule } from 'ngx-wheel';
import { SpinwheelPage } from './spinwheel.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgxWheelModule,
    RouterModule.forChild([
      {
        path: '',
        component: SpinwheelPage
      }
    ])
  ],
  declarations: [SpinwheelPage]
})
export class SpinwheelPageModule { }
