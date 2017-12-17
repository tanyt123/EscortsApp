import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import firebase from 'firebase';
import { FormsModule } from "@angular/forms";
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ViewChild } from '@angular/core'
import { UpdateprofilePage } from '../updateprofile/updateprofile';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  myForm: FormGroup;
  public ages: string;
  public AgeError: boolean = false;
  isenabled: boolean = false;
  public date;
  changeDate = '';
  correct_data;
  public myDate: string
  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, public formBuilder: FormBuilder) {


  }

  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Escorts');
  ionViewDidLoad() {

    console.log('ionViewDidLoad ProfilePage');
    this.items = [];

    // var appData = window.localStorage.getItem('app-name');

    var appData = "tanyongting1234@gmail.com";
    this.itemRef.orderByChild("Email").equalTo(appData).once('value', (snap) => {
         var key = Object.keys(snap.val())
      snap.forEach(itemSnap => {
        this.items.push(itemSnap.val());
        this.date = itemSnap.child("DOB").val();
        return false;

      });
      this.myDate = this.date;
      console.log(key);
    });

  }
 Update(){
   this.navCtrl.push(UpdateprofilePage);
 }
}









