import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Refresher, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { SinglebookPage } from '../singlebook/singlebook';
import { Observable } from 'rxjs/Observable';
import { FiltersPage } from '../filters/filters';
import 'rxjs/add/operator/map'
import { ModalController } from 'ionic-angular';
export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
  itemsRef: AngularFireList<any>;

}
@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  public itemss: Array<any> = [];
  items: Observable<any[]>;
   times: Observable<any[]>;
  itemsRef: AngularFireList<any>;
  selectedDate;
  timeMin2: any;
  Genders;
  timeMax2: any;
  PickUpClicked: boolean = false;
  GenderClicked: boolean = false;
  visible: boolean = false;
  pickup: boolean = false;
  gender: boolean = false;
  male: boolean = true;
  female: boolean = true;
  structure;
  toggle: boolean = true;
  DateClicked: boolean = false;
  public buttonClicked: boolean = false;
  today = new Date().toJSON().split('T')[0];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public menuCtrl: MenuController, afDatabase: AngularFireDatabase, public modalCtrl: ModalController) {
    this.itemsRef = afDatabase.list('Bookings',
      ref => ref.orderByChild('startTime')
    );
  
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === 'Pending' || items.Status === 'Cancelled') && items.Date >= this.today);
    });

    this.times =     this.items.map(time => {
       const speakers = time.map(r => r.startTime);
        const distinctSpeakers = [...new Set(speakers)]; 
        return distinctSpeakers;
      }
      );
    
  }
  Filter() {
    this.buttonClicked = !this.buttonClicked;
    this.toggle = !this.toggle;
    this.DateClicked = false;
    this.PickUpClicked = false;
    this.visible = false;
    this.pickup = false;
    this.gender = false;
    this.GenderClicked = false;

  }
  Date() {
    if (this.DateClicked == false) {
      this.DateClicked = true;
      this.visible = true;
    }
    else {
      this.DateClicked = false;
      this.visible = false;
    }
  }
  Gender() {
    if (this.GenderClicked == false) {
      this.GenderClicked = true;
      this.gender = true;
    }
    else {
      this.GenderClicked = false;
      this.gender = false;
    }
  }

  // console.log(this.selectedDate)
  // this.items = this.itemsRef.snapshotChanges().map(changes => {

  //   return changes.map(c =>
  //     ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
  //       (items.Status === '' || items.Status === 'Cancelled') && items.Date === this.selectedDate
  //     );

  // });

  //  this.items = this.items.map(item => {
  //    return item.filter(items => items.Gender === 'Female')
  //  })
  // this.items = this.items.map(item => {
  //    return item.filter(items => items.Address === 'SG  ')
  // })
  setBadge(time) {
    this.timeMin2 = this.structure.lower;
    this.timeMax2 = this.structure.upper;
  }
  PickUp() {
    if (this.PickUpClicked == false) {
      this.PickUpClicked = true;
      this.pickup = true;
    }
    else {
      this.PickUpClicked = false;
      this.pickup = false;
    }
  }

  Filters() {
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === 'Pending' || items.Status === 'Cancelled') && items.Date >= this.today
        );
    });

    if (this.selectedDate) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      setTimeout(() => {
        loading.dismiss();
      }, 3000);
      this.items = this.items.map(item => {
        return item.filter(items => items.Date === this.selectedDate)
      })
    }


    if (this.Genders === 'Female') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      setTimeout(() => {
        loading.dismiss();
      }, 3000);
      this.female = false;
      this.male = true;
      this.items = this.items.map(item => {
        return item.filter(items => items.Gender === this.Genders)
      })
      this.Genders = null;
    }
    else if (this.Genders === 'Male') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      setTimeout(() => {
        loading.dismiss();
      }, 3000);
      this.male = false;
      this.female = true;
      this.items = this.items.map(item => {
        return item.filter(items => items.Gender === this.Genders)
      })
      this.Genders = null;
    }
    else if (this.Genders === 'All') {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      setTimeout(() => {
        loading.dismiss();
      }, 3000);
      this.male = true;
      this.female = true;
      this.Genders = null;
    }

  }
  FilterGender() {
    if (this.Genders) {
      this.Filters();
    }
  }
  gotoPage(key) {

    this.navCtrl.push(SinglebookPage, {
      key: key,
      Status: 'Pending'
    });

  }
  openMenu() {
    this.menuCtrl.open();
  }
  toggleMenu() {
    this.menuCtrl.toggle();
  }
  ionViewDidLoad() {
    console.log(new Date(), '----', new Date().toJSON().split('T')[0]);
    this.structure = { lower: -5, upper: 5 }
    this.selectedDate= this.today;
      this.items = this.items.map(item => {
        return item.filter(items => items.Date === this.selectedDate)
      })
  }
  /* doRefresh(refresher: Refresher) {
       this.itemsRef = this.afDatabase.list('Bookings',
       ref => ref.orderByChild('Status').equalTo(""));
     this.items = this.itemsRef.snapshotChanges().map(changes => {
       return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
     });
 
       // simulate a network request that would take longer
       // than just pulling from out local json file
       setTimeout(() => {
         refresher.complete();
 
         const toast = this.toastCtrl.create({
           message: 'Sessions have been updated.',
           duration: 3000
         });
         toast.present();
       }, 1000);
     });
   }*/
}
