import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },

  {
    path: 'register',
    loadChildren: './register/register.module#RegisterPageModule'
  },
  {
    path: 'main-page',
    loadChildren: './main-page/main-page.module#MainPagePageModule'
  },
  {
    path: 'main-page/:userLoged',
    loadChildren: './main-page/main-page.module#MainPagePageModule'
  },
  {
    path: 'game',
    loadChildren: './game/game.module#GamePageModule'
  },
  {
    path: 'game/:userLoged/:idGame',
    loadChildren: './game/game.module#GamePageModule'
  },
  {
    path: 'director',
    loadChildren: './director/director.module#DirectorPageModule'
  },
  {
    path: 'director/:userLoged/:idDirector',
    loadChildren: './director/director.module#DirectorPageModule'
  },
  {
    path: 'developer',
    loadChildren: './developer/developer.module#DeveloperPageModule'
  },
  {
    path: 'developer/:userLoged/:idDeveloper',
    loadChildren: './developer/developer.module#DeveloperPageModule'
  },
  { 
    path: 'publisher',
    loadChildren: './publisher/publisher.module#PublisherPageModule' 
  },
  { 
    path: 'publisher/:userLoged/:idPublisher',
    loadChildren: './publisher/publisher.module#PublisherPageModule' 
  },
  { 
    path: 'suggestions', 
    loadChildren: './suggestions/suggestions.module#SuggestionsPageModule' 
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
