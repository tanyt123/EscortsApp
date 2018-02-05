import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { AngularFireAuthModule, AngularFireAuth, AngularFireAuthProvider, AUTH_PROVIDERS } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireList, } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Http } from '@angular/http';
import { Navbar } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { HomePage } from '../home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { BookingPage } from '../booking/booking';
import { ResetPage } from '../reset/reset';
import { Events } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild(Navbar) navBar: Navbar;
  private authState: Observable<firebase.User>;
  private currentUser: firebase.User;
  public itemRef: firebase.database.Reference = firebase.database().ref('Escorts');
  email: '';
  password: '';
  name = "";
  gender;
  pic;
  public loading: Loading;
  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController, private toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public navParams: NavParams,
    private afAuth: AngularFireAuth, public events: Events, private nativeStorage: NativeStorage) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.setBackButtonAction();

  }
  public type = 'password';
  public showPass = false;


  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.push(HomePage);
      this.navCtrl.setRoot(HomePage);
    }
  }
  Reset() {
    this.navCtrl.push(ResetPage);
  }

  Login() {

    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(auth => {
          console.log("Enough!")
        try {
          firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user.emailVerified) {
              window.localStorage.setItem('Email', this.email);
              console.log(window.localStorage.getItem('Email'));
              this.itemRef.orderByChild("Email").equalTo(this.email).once('value', (snap) => {
                console.log(snap.val());
                snap.forEach(itemSnap => {

                  this.name = itemSnap.child("Name").val();
                  console.log(this.name);

                  this.gender = itemSnap.child("Gender").val();
                  window.localStorage.setItem('Gender', this.gender);
                  this.pic = itemSnap.child('Pic').val();


                  return false;

                });
                window.localStorage.setItem('Name', this.name);
                console.log(this.name);
                console.log(window.localStorage.getItem('Name'));

                window.localStorage.setItem('Pic', this.pic);
                console.log(this.pic);
                console.log(window.localStorage.getItem('Pic'));
                this.events.publish('profileInserted');
              }),
                this.email = "";
              this.password = "";
              this.navCtrl.push(BookingPage);
              this.navCtrl.setRoot(BookingPage).then(() => {
                this.navCtrl.popToRoot();

              });
            }
            else if (!user.emailVerified) {
              let alert = this.alertCtrl.create({
                message: "Email not verified. Please verify again.",
                buttons: [{ text: "Ok" }]
              });

              alert.present();
              user.sendEmailVerification();
            }

          });
        } catch (err) {
          let toast = this.toastCtrl.create({
            message: err.message,
            duration: 1000
          });
          toast.present();
        }
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

