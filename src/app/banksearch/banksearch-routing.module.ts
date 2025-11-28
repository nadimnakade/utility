import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BanksearchPage } from './banksearch.page';

const routes: Routes = [
  {
    path: '',
    component: BanksearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanksearchPageRoutingModule {}
