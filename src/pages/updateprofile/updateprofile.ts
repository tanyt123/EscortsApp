import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import firebase from 'firebase';
import { FormsModule } from "@angular/forms";
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ViewChild } from '@angular/core'
import { AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { Navbar } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-updateprofile',
  templateUrl: 'updateprofile.html',
})
export class UpdateprofilePage {

  myForm: FormGroup;
  public ages: string;
  public AgeError: boolean = false;
  isenabled: boolean = true;
  public key;
  public date;
  public email;
  public gender;
  public password;
  changeDate = '';
  correct_data;
  public myDate: string
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private nativeStorage: NativeStorage, public formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      Name: ['', Validators.required],
      Username: ['', Validators.required],
      tel: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*'), Validators.required])],


      address: ['', Validators.required],



      IC: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern('[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1}')])],
      plateNo: ['', Validators.required],
      age: ['',],


      myDate: ['', Validators.required],

    })

  }

  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Escorts');
  public itemsRef: firebase.database.Reference;


  ionViewDidLoad() {
 
    console.log('ionViewDidLoad UpdateProfilePage');
    this.items = [];

    // var appData = window.localStorage.getItem('app-name');

    var appData = "tanyongting1234@gmail.com";
    this.itemRef.orderByChild("Email").equalTo(appData).once('value', (snap) => {
      this.key = Object.keys(snap.val());
      snap.forEach(itemSnap => {
        this.items.push(itemSnap.val());
        this.date = itemSnap.child("DOB").val();
        this.ages = itemSnap.child("Age").val();
        this.email = itemSnap.child("Email").val();
        this.gender = itemSnap.child("Gender").val();
        this.password = itemSnap.child("Password").val();
        return false;

      });
      this.myDate = this.date;
      this.itemsRef = firebase.database().ref('Escorts/' + this.key);
    });

  }

  public getAge() {

    var selDate = new Date().getFullYear() - new Date(this.myForm.value.myDate).getFullYear();
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
  Update() {

    try {
     
      this.isenabled = false;
      this.itemsRef.update({
        Name: this.myForm.value.Name,
        Username: this.myForm.value.Username,
        Tel: this.myForm.value.tel,
        Address: this.myForm.value.address,
        Age: this.ages,
        DOB: this.myForm.value.myDate,
        PlateNo: this.myForm.value.plateNo,
        IC: this.myForm.value.IC,
      });
      console.log(this.itemsRef);
      let alert = this.alertCtrl.create({
        title: 'Profile updated!',
        buttons: [
          {
            text: 'OK',
            handler: data => {
                   this.navCtrl.push(ProfilePage);
                   this.navCtrl.setRoot(ProfilePage).then(() =>{
    this.navCtrl.popToRoot();
                   
            });
          }
          }
        ],

      });
      alert.present();

    
    } catch (e) {
      console.log(e);

    }
  }
}
