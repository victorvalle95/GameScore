import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SuggestionsPage } from './suggestions.page';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

const routes: Routes = [
  {
    path: '',
    component: SuggestionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuggestionsPage,    EmailComposer
  ],
  providers: [
    EmailComposer
  ]
})
export class SuggestionsPageModule {}
