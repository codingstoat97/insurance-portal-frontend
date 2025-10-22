import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
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
    loadChildren: () =>
      import('./features/pages/broker/broker.module')
        .then(m => m.BrokerModule),
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
