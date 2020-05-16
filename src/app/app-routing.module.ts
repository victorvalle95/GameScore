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
    path: 'game', 
    loadChildren: './game/game.module#GamePageModule' 
  },
  {
    path: 'game/:idGame',
    loadChildren: './game/game.module#GamePageModule'
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
