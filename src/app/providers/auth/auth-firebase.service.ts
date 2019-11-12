import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  private user: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = this.afAuth.authState;
  }

  // Obtener el estado de autenticación
  get authenticated(): boolean {
    return this.user != null; // True ó False
  }
  // Obtener el observador del usuario actual
  get currentUser(): Observable<firebase.User | null> {
    return this.user;
  }

  // Registro con email
  signUpWithEmail(email, pass): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
  }
  // Ingreso con email
  signInWithEmail(email, pass): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pass)
  }

  recoveryPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email).then(function () {
      // Email sent.
    }).catch(function (error) {
      // An error happened.
    });
  }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }  
  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
        console.log('You have been successfully logged in!')
    }).catch((error) => {
        console.log(error)
    })
  }
}
