import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PickerColumnOption } from 'ionic-angular';
import firebase from 'firebase';
import { SchedulePage } from '../schedule/schedule';
import { BookingPage } from '../booking/booking';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-singlebook',
  templateUrl: 'singlebook.html',
})
export class SinglebookPage {
  public key;
  public name;
  isenabled: boolean = true;
  status;
  email;
  
  button: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }
 pages = [
       
         { title: 'MySchedule', component: SchedulePage },
     
      ];
    
  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  public itemRefs: firebase.database.Reference;
  ionViewDidLoad() {
    this.email = window.localStorage.getItem('Email');
    this.key = this.navParams.get('key');
  this.status = this.navParams.get('Status');
  if(this.status ==='Pending'){
    this.button = true;
  }
    if(this.status ==='Accepted'){
    this.button = false;
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
      .then(() =>{
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
        Driver: "",
      })
      let alert = this.alertCtrl.create({
          title: 'You have cancelled the booking!',
          buttons: ['OK']
        });
        alert.present();
      
        this.navCtrl.push(SchedulePage);
      this.navCtrl.setRoot(SchedulePage)
      .then(() =>{
    this.navCtrl.popToRoot();
                   
            });
    }
    catch (e) {
      console.log(e);

    }
  }
}




