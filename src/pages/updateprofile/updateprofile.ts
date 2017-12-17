import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import firebase from 'firebase';
import { FormsModule } from "@angular/forms";
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ViewChild } from '@angular/core'
/**
 * Generated class for the UpdateprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updateprofile',
  templateUrl: 'updateprofile.html',
})
export class UpdateprofilePage {
 myForm: FormGroup;
  public ages: string;
  public AgeError: boolean = false;
  isenabled: boolean = false;
  public date;
  changeDate = '';
  correct_data;
  public myDate: string
  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, public formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      Name: ['', Validators.required],
      Username: ['', Validators.required],
      tel: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*'), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],

      address: ['', Validators.required],

      password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(25), Validators.required])],
      rePassword: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(25), Validators.required])],
      Gender: ['', Validators.required],
      IC: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern('[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1}')])],
      plateNo: ['', Validators.required],
      age: ['',],


      myDate: ['', Validators.required],

    })

  }

  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Escorts');
  ionViewDidLoad() {

    console.log('ionViewDidLoad ProfilePage');
    this.items = [];

    // var appData = window.localStorage.getItem('app-name');

    var appData = "tanyongting1234@gmail.com";
    this.itemRef.orderByChild("Email").equalTo(appData).once('value', (snap) => {
      snap.forEach(itemSnap => {
        this.items.push(itemSnap.val());
        this.date = itemSnap.child("DOB").val();
        return false;

      });
      this.myDate = this.date;
      console.log(this.date);
    });

  }
  public getAge() {

    var selDate = new Date().getFullYear() - new Date(this.myForm.value.DOB).getFullYear();
    this.ages = selDate.toString();
    document.getElementById('age').getElementsByTagName('input')[0].value = this.ages;
    this.myForm.value.age = this.ages;
    if (selDate < 18 || selDate > 70) {
      this.AgeError = true;
      this.isenabled = false;
    }
    else {
      this.AgeError = false;
      this.isenabled = true;
    }

  }
  
}
