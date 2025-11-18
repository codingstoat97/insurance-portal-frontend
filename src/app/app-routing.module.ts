import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'quotes',
    loadChildren: () =>
      import('./features/pages/quotes/quotes.module')
        .then(m => m.QuotesModule),
  },
  {
    path: 'broker',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/pages/broker/broker.module')
        .then(m => m.BrokerModule),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/pages/admin/admin.module')
        .then(m => m.AdminModule),
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
