import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PincodesearchPage } from './pincodesearch.page';

const routes: Routes = [
  {
    path: '',
    component: PincodesearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PincodesearchPageRoutingModule {}