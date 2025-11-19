import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmiPage } from './emi.page';

const routes: Routes = [
  {
    path: '',
    component: EmiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmiPageRoutingModule {}
