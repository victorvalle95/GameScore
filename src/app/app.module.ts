import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FirebaseService } from '../services/firebase.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalMediaCriticsComponent } from './modal-media-critics/modal-media-critics.component';
import { ModalUserCriticsComponent } from './modal-user-critics/modal-user-critics.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


const firebaseConfig = {
  apiKey: "AIzaSyBLu3L8C3_JHL4OXsdZAhldnG4NymYyVwc",
  authDomain: "gamescore-c3aef.firebaseapp.com",
  databaseURL: "https://gamescore-c3aef.firebaseio.com",
  projectId: "gamescore-c3aef",
  storageBucket: "gamescore-c3aef.appspot.com",
  messagingSenderId: "876295085970",
  appId: "1:876295085970:web:ee3cdd1c23627797e62b4b",
  measurementId: "G-CHWVSSDNXW"
};


@NgModule({
  declarations: [
    AppComponent,
    ModalMediaCriticsComponent,
    ModalUserCriticsComponent,
    

  ],
  entryComponents: [    
    ModalMediaCriticsComponent,
    ModalUserCriticsComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    HttpClientModule,

  
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseService,
    AngularFireDatabase,
    FormsModule,
    YoutubeVideoPlayer,
    ScreenOrientation,
    EmailComposer
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
