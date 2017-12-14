import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController , Loading, LoadingController } from 'ionic-angular';
import { AngularFireAuthModule, AngularFireAuth,AngularFireAuthProvider,AUTH_PROVIDERS } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireList,  } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Http } from '@angular/http';

import { HomePage } from '../home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import {BookingPage } from '../booking/booking';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private authState: Observable<firebase.User>;
     private currentUser: firebase.User;
       email: '';
    password: '';
public loading: Loading;
  constructor(public navCtrl: NavController,
 public alertCtrl: AlertController, private toastCtrl: ToastController, public loadingCtrl:LoadingController, public navParams: NavParams,private afAuth: AngularFireAuth, private nativeStorage: NativeStorage) {

   
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
Login( ){
 this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then(auth => {
      window.localStorage.setItem( 'app-name', JSON.stringify(this.email));
      this.navCtrl.push(BookingPage);

      this.navCtrl.setRoot(BookingPage);
    })
    .catch(err => {
         let toast = this.toastCtrl.create({
        message: err.message,
        duration: 1000
      });
      toast.present();
    });

  }
}

