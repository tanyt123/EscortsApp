import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PickerColumnOption } from 'ionic-angular';
import firebase from 'firebase';
import { SchedulePage } from '../schedule/schedule';
import { BookingPage } from '../booking/booking';
import { MySchedulePage } from '../my-schedule/my-schedule';
import { AlertController } from 'ionic-angular';

import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireList, } from 'angularfire2/database';
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
  keys;
  date;
  count;
  pickup;
  destination;
  startTime;
  endTime;
  StartTime;
  carpool;
  EndTime;
  itemsRef: AngularFireList<any>;
  myForm: FormGroup;
  button: boolean;
  public DSEARef: firebase.database.Reference;
  constructor(public navCtrl: NavController, public navParams: NavParams, afDatabase: AngularFireDatabase, public formBuilder: FormBuilder, public alertCtrl: AlertController) {
    this.itemsRef = afDatabase.list('EscortBookings');

    this.myForm = formBuilder.group({
      Rod: ['', Validators.required],

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
      this.startTime = itemkeySnapshot.val().startTime;
      this.endTime = itemkeySnapshot.val().endTime;
      this.date = itemkeySnapshot.val().Date;
      this.pickup = itemkeySnapshot.val().Pickup;
      this.destination = itemkeySnapshot.val().Destination;
      this.carpool = itemkeySnapshot.val().Carpool;
      this.items.push(itemkeySnapshot.val());
      this.itemRefs = firebase.database().ref('Bookings/' + this.key);
    });




    return false;



  }
  getRoundedTime(inDate) {
    var d = new Date();
    if (inDate) {
      d = inDate;
    }
    var ratio = d.getMinutes() / 60;
    // Past 30 min mark, return epoch at +1 hours and 0 minutes
    if (ratio > 0.5) {
      console.log(d.getHours());
      return ((d.getHours() + 1) + ":00");
    }
    // Before 30 minute mark, return epoch at 0 minutes
    if (ratio <= 0.5) {
      console.log(d.getHours());
      return (d.getHours() + ":00");
    }

  }
  Accept() {
    this.startTime = this.getRoundedTime(new Date(this.date + " " + this.startTime));
    this.endTime = this.getRoundedTime(new Date(this.date + " " + this.endTime));
    var EPD = this.email + "," + this.pickup + "," + this.destination;
console.log(this.startTime);
    try {
      this.isenabled = false;
      this.itemRefs.update({
        Status: "Accepted",
        Driver: this.email,
      });
      var ref = firebase.database().ref("EscortBookings");
      if (ref) {
        if (this.carpool === 'Yes') {

          ref.orderByChild("EPD").equalTo(EPD).once('value', (snap) => {

            if (snap.val()) {
              snap.forEach(itemSnap => {
                console.log(new Date(itemSnap.child("Date").val() +" " + this.startTime));
                if (new Date(itemSnap.child("Date").val() + " " + this.startTime) >= new Date(itemSnap.child("Date").val() + " " + itemSnap.child("StartTime").val())
                  && new Date(itemSnap.child("Date").val() + " " + this.startTime) <= new Date(itemSnap.child("Date").val() + " " + itemSnap.child("EndTime").val())) {
                   console.log('Hi');
                  this.count = parseInt(itemSnap.val().Count) + 1;

                }
                else {
                  console.log('Haaai');
                  this.itemsRef.push({
                    EPD: EPD,
                    StartTime: this.startTime,
                    EndTime: this.endTime,
                    Date: this.date,
                    Count: 1
                  })
                }
                return false;
              });

              this.keys = Object.keys(snap.val());
              this.DSEARef = firebase.database().ref('EscortBookings/' + this.keys);
              console.log(this.DSEARef);
              this.DSEARef.update({
                Count: this.count
              });

            }
            else {
              console.log('Haaai');
              this.itemsRef.push({
                EPD: EPD,
                StartTime: this.startTime,
                EndTime: this.endTime,
                Date: this.date,
                Count: 1
              })
            }
          });
        }

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
    }
    catch (e) {
      console.log(e);

    }
  }
  Cancel() {
    this.startTime = this.getRoundedTime(new Date(this.date + " " + this.startTime));
    this.endTime = this.getRoundedTime(new Date(this.date + " " + this.endTime));
    var EPD = this.email + "," + this.date + "," + this.pickup + "," + this.destination;
    try {
      this.isenabled = false;
      this.itemRefs.update({
        Status: "Cancelled",

        ROD: this.myForm.value.Rod,
      })
      var ref = firebase.database().ref("EscortBookings");
      ref.orderByChild("EPD").equalTo(EPD).once('value', (snap) => {
        if (snap.val()) {
          this.keys = Object.keys(snap.val());
          this.DSEARef = firebase.database().ref('EscortBookings/' + this.keys);
          this.DSEARef.update({
            Count: parseInt(snap.val().Count) - 1
          });
        }

      });
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




