import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanycategoryPage } from './companycategory.page';

const routes: Routes = [
  {
    path: '',
    component: CompanycategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanycategoryPageRoutingModule {}
