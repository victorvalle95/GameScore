import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {FirebaseService} from '../services/firebase.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginPage } from './login/login.page';

const firebaseConfig = {
  apiKey: "AIzaSyAMyYhpHUv9iNfQvH6Ki39jKa4hy1q4sdg",
  authDomain: "gamescore-f0cc0.firebaseapp.com",
  databaseURL: "https://gamescore-f0cc0.firebaseio.com",
  projectId: "gamescore-f0cc0",
  storageBucket: "gamescore-f0cc0.appspot.com",
  messagingSenderId: "260409849548",
  appId: "1:260409849548:web:1c3f49ffeecb7c21"
};

@NgModule({
  declarations: [
    AppComponent,   
    LoginPage
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseService,
    AngularFireDatabase,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
