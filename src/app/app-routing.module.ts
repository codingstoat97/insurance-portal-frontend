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
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
