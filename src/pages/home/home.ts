import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegistrationPage } from '../registration/registration';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
SignUp(){
  this.navCtrl.push(RegistrationPage);
}
Login(){
  this.navCtrl.push(LoginPage);
}
}
