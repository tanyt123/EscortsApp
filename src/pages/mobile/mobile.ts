import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController,NavParams } from 'ionic-angular';

import firebase from 'firebase';
import { Sim } from '@ionic-native/sim';
import { FormsModule } from "@angular/forms";
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-mobile',
  templateUrl: 'mobile.html',
})
export class MobilePage {
public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
 myForm: FormGroup;
 masks: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
  
      tel: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*'), Validators.required])],
      code : ['', Validators.required]
    })
 }


  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  'size': 'normal',
  'callback': function(response) {
    
  },
  'expired-callback': function() {

  }
});
  }
signIn(){

  const appVerifier = this.recaptchaVerifier;
  const phoneNumberString =  "+" + this.myForm.value.code +this.myForm.value.tel;

  firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
    .then( confirmationResult => {

        let prompt = this.alertCtrl.create({
        title: 'Enter the Confirmation code',
        inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
        buttons: [
          { text: 'Cancel',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Send',
            handler: data => {
              confirmationResult.confirm(data.confirmationCode)
                .then(function (result) {
                  // User signed in successfully.
                  console.log(result.user);
                  // ...
                }).catch(function (error) {
                   console.log(error);
                  // User couldn't sign in (bad verification code?)
                  // ...
                });
            }
          }
        ]
      });
      prompt.present();
  })
  .catch(function (error) {
    console.error("SMS not sent", error);
  });

}
}
