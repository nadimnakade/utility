import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //{ path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'companycategory',
    loadChildren: () => import('./companycategory/companycategory.module').then( m => m.CompanycategoryPageModule)
  },
  {
    path: 'emi',
    loadChildren: () => import('./emi/emi.module').then( m => m.EmiPageModule)
  },
  {
    path: 'offer',
    loadChildren: () => import('./offer/offer.module').then( m => m.OfferPageModule)
  },
  {
    path: 'companycategory',
    loadChildren: () => import('./companycategory/companycategory.module').then( m => m.CompanycategoryPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },  
  {
    path: 'spinwheel',
    loadChildren: () => import('./spinwheel/spinwheel.module').then( m => m.SpinwheelPageModule)
  },  
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
