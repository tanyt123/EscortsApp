import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SMS } from '@ionic-native/sms';
declare var cordova: any;
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireList, } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuthModule, AngularFireAuth, } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from "@angular/forms";
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import * as firebase from 'firebase';

import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})

export class RegistrationPage {
  imageURL;
  itemsRef: AngularFireList<any>;
  public ages: string;
  public AgeError: boolean = false;
  isenabled: boolean = false;
  public mismatchedPasswords: boolean = false;
  public age: number;
  myForm: FormGroup;
  public error: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, private transfer: Transfer,
    private file: File, private filePath: FilePath, public formBuilder: FormBuilder,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController, public platform: Platform,
    public loadingCtrl: LoadingController, private sms: SMS, private afAuth: AngularFireAuth, 
    afDatabase: AngularFireDatabase, public alertCtrl: AlertController) {
    this.itemsRef = afDatabase.list('Escorts');

    this.myForm = formBuilder.group({
      Name: ['', Validators.required],
      Username: ['', Validators.required],
      tel: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*'), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],

      address: ['', Validators.required],


      gender: ['', Validators.required],
      IC: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern('[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1}')])],
      plateNo: ['', Validators.required],

      age: ['',],
      DOB: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(25), Validators.required])],
      rePassword: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(25), Validators.required])],
    })
  }
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }




  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.imageURL = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }
  matchingPasswords() {


    if (this.myForm.value.password !== this.myForm.value.rePassword) {
      this.myForm.get('rePassword').setErrors({ Mismatch: true })
      this.mismatchedPasswords = true;

    }
    else {

      this.mismatchedPasswords = false;
    }
  }





  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');

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
      console.log(this.isenabled)
    }

  }
  Register() {
    try {
      this.isenabled = false;
      this.afAuth.auth.createUserWithEmailAndPassword(this.myForm.value.email, this.myForm.value.password).then(auth => {

        let user: any = firebase.auth().currentUser;
        firebase.auth().onAuthStateChanged(function (user) {
          user.sendEmailVerification();
        });
        
        this.itemsRef.push({
          Name: this.myForm.value.Name,
          Username: this.myForm.value.Username,
          Tel: this.myForm.value.tel,
          Email: this.myForm.value.email,

          Address: this.myForm.value.address,
          Age: this.ages,
          DOB: this.myForm.value.DOB,
          PlateNo: this.myForm.value.plateNo,
          IC: this.myForm.value.IC,
          Gender: this.myForm.value.gender,

        }).then((itemsRef) => {
          this.itemsRef.push({
            Key: itemsRef.key
          });
        });;





        let alert = this.alertCtrl.create({
          title: 'Email verification sent!',
          buttons: ['OK']
        });
        alert.present();
        this.myForm.reset();
        this.navCtrl.push(LoginPage);
      })
        .catch(err => {
          // Handle error
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: err.message,
            buttons: ['OK']
          });
          alert.present();
        });
      this.isenabled = true;
    }

    catch (e) {
      console.log(e);
      this.isenabled = true;
    }

  }


}
  /*Register(Name,Username,tel,email,password,rePassword,address,age,Issuedate,ExpiryDate,gender,IC,plateNo){
    if(password===rePassword){
  try{
      this.itemsRef.push({
        name: Name,
        Username:Username,
         tel: tel,
         email:email,
         password:password,
        address: address,
       age:age,
       Issuedate:Issuedate,
       ExpiryDate:ExpiryDate,
        gender: gender
      });
    this.afAuth.auth.createUserWithEmailAndPassword(email,password)  .then(auth => {
  
  
   console.log(auth);
   let alert = this.alertCtrl.create({ 
          title: 'User created!',
            buttons: ['OK']
       });
  alert.present();
       this.navCtrl.push(LoginPage);
    })
      .catch(err => {
        // Handle error
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: err.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }
  
      catch(e){
   console.log(e);
   
      }
       
    }
    else{
      let alert = this.alertCtrl.create({ 
        title: 'Incorrect Password!',
    
        buttons: ['OK']
        
      });
      alert.present();
      
    }*/






  /*sendTextMessage() {
    this.sms.send(this.text.number, this.text.message).then((result) => {
      let successToast = this.toastCtrl.create({
        message: "Text message sent successfully! :)",
        duration: 3000
      })
      successToast.present();
    }, (error) => {
      let errorToast = this.toastCtrl.create({
        message: error  ,
        duration: 3000
      })
      errorToast.present();
    });
 }*/


