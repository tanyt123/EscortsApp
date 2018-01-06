import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuthModule, AngularFireAuth, AngularFireAuthProvider, AUTH_PROVIDERS } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {
  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email);
    let alert = this.alertCtrl.create({
      title: 'A link has been sent to reset your password!',
      buttons: [
        {
          text: 'OK',
          cssClass: 'buttonOkCss',

          handler: data => {
            this.navCtrl.push(LoginPage);
         

          }
        }
      ],
    });
    alert.present();
  }
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPage');
  }

}
