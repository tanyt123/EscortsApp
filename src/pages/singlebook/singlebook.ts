import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PickerColumnOption } from 'ionic-angular';
import firebase from 'firebase';
import { SchedulePage } from '../schedule/schedule';
import { BookingPage } from '../booking/booking';
import { MySchedulePage } from '../my-schedule/my-schedule';
import { AlertController } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-singlebook',
  templateUrl: 'singlebook.html',
})
export class SinglebookPage {
  public key;
  public name;
  isenabled: boolean = true;
    visible: boolean = false;
  status;
  email;
 myForm: FormGroup;
  button: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder, public alertCtrl: AlertController) {
    this.myForm = formBuilder.group({
     Rod : ['', Validators.required],

    })

  }


  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  public itemRefs: firebase.database.Reference;
  ionViewDidLoad() {
    this.email = window.localStorage.getItem('Email');
    this.key = this.navParams.get('key');
    this.status = this.navParams.get('Status');
    if (this.status === 'Pending') {
      this.button = true;
         this.visible = false;
    }
    if (this.status === 'Accepted') {
      this.button = false;
      this.visible = true;
    }
    this.itemRef.child(this.key).once('value', (itemkeySnapshot) => {

      this.items.push(itemkeySnapshot.val());
      console.log(this.items);
      this.itemRefs = firebase.database().ref('Bookings/' + this.key);
    });




    return false;



  }
  Accept() {
    try {
      this.isenabled = false;
      this.itemRefs.update({
        Status: "Accepted",
        Driver: this.email,
      })
      let alert = this.alertCtrl.create({
        title: 'You have accepted the booking!',
        buttons: ['OK']
      });
      alert.present();

      this.navCtrl.push(BookingPage);
      this.navCtrl.setRoot(BookingPage)
        .then(() => {
          this.navCtrl.popToRoot();

        });
    }
    catch (e) {
      console.log(e);

    }
  }
  Cancel() {
    try {
      this.isenabled = false;
      this.itemRefs.update({
        Status: "Cancelled",
      
        ROD : this.myForm.value.Rod,
      })
      let alert = this.alertCtrl.create({
        title: 'You have cancelled the booking!',
        buttons: ['OK']
      });
      alert.present();

      this.navCtrl.push(MySchedulePage);
      this.navCtrl.setRoot(MySchedulePage)
        .then(() => {
          this.navCtrl.popToRoot();

        });
    }
    catch (e) {
      console.log(e);

    }
  }
}




