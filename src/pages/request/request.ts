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
import { Navbar } from 'ionic-angular';
import { BookingPage } from '../booking/booking';
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
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
  @ViewChild(Navbar) navBar: Navbar;
  public itemss: Array<any> = [];
  items: Observable<any[]>;
  public times: Array<any> = [];
  itemsRef: AngularFireList<any>;
  selectedDate;
  timeMin2: any;
  Genders;
  startTimes;
  endTimes;
  keys;
  public DSEARef: firebase.database.Reference;
  max: Observable<any[]>;
  timeMax2: any;
  PickUpClicked: boolean = false;
  GenderClicked: boolean = false;
  visible: boolean;
  pickup: boolean = false;
  gender: boolean = false;
  male: boolean = true;
  female: boolean = true;
  structure;
  email;
  Gender;
  hour;
  hours;
  toggle: boolean = true;
  DateClicked: boolean = false;
  public buttonClicked: boolean = false;
  today = new Date().toJSON().split('T')[0];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public menuCtrl: MenuController, afDatabase: AngularFireDatabase, public modalCtrl: ModalController) {
    this.itemsRef = afDatabase.list('Bookings',
      ref => ref.orderByChild('Time')
    );
    this.Gender = window.sessionStorage.getItem('Gender');
    this.selectedDate = this.navParams.get('date');


  }

  getRoundedTime(inDate) {
    var d = new Date();
    if (inDate) {
      d = inDate;
    }
    var ratio = d.getMinutes() / 60;
    // Past 30 min mark, return epoch at +1 hours and 0 minutes
    if (ratio >= 0.5) {
      console.log(d.getHours());
      return ((d.getHours() + 1) + ":00");
    }
    // Before 30 minute mark, return epoch at 0 minutes
    if (ratio < 0.5) {
      console.log(d.getHours());
      return (d.getHours() + ":00");
    }

  }
  gotoPage(key) {

    this.navCtrl.push(SinglebookPage, {
      key: key,
      Status: 'Pending'
    });

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Loading data...',
      showBackdrop: true
    });

    // Show the popup
    loading.present();


    setTimeout(() => {
      loading.dismiss();
    }, 3000);
    this.getInitialItems();
  }
  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.push(BookingPage);
      this.navCtrl.setRoot(BookingPage);
    }

  }
  getInitialItems() {

    this.items = this.itemsRef.snapshotChanges().map(changes => {

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === 'Pending') && items.Date === this.selectedDate && items.EscortsGender === this.Gender);
    });

    this.itemsRef.snapshotChanges().map(changes => {

      this.email = window.sessionStorage.getItem('Email');

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Driver === this.email) && (items.Status === 'Accepted') && items.Date === this.selectedDate);
    }).subscribe(time => {
      var schedules = [];

      schedules = time;
      console.log(schedules);
      for (var i = 0; i < schedules.length; i++) {


        var startTime = (new Date(schedules[i].Date + " " + schedules[i].startTime));
        var endTime = (new Date(schedules[i].Date + " " + schedules[i].endTime));
        this.startTimes = this.getRoundedTime(new Date(schedules[i].Date + " " + schedules[i].startTime));
        this.endTimes = this.getRoundedTime(new Date(schedules[i].Date + " " + schedules[i].endTime));
        var EDSEPD = this.email + "," + schedules[i].Date + "," + this.startTimes + "," + this.endTimes
          + "," + schedules[i].PickupRegion + "," + schedules[i].DestinationRegion;
        console.log(EDSEPD);
        var pickup = schedules[i].PickupRegion;
        var destination = schedules[i].DestinationRegion;
        if (schedules[i].Carpool === 'No') {
          console.log(EDSEPD);
          console.log(schedules);

          console.log(startTime);
          this.items = this.items.map(item => {
            return item.filter(items =>
              ((new Date(items.Date + " " + items.startTime)) <
                startTime && (new Date(items.Date + " " + items.endTime)) <=
                startTime)
              ||
              ((new Date(items.Date + " " + items.startTime)) >=
                endTime)
            )
          })
        }
        if (schedules[i].Carpool === 'Yes') {

          var ref = firebase.database().ref("EscortBookings");
          if (ref) {

            ref.orderByChild("EDSEPD").equalTo(EDSEPD).once('value', (snap) => {

              if (snap.val()) {
                console.log("It loops.");
                snap.forEach(itemSnap => {
                  console.log(parseInt(itemSnap.val().Count))

                  if (parseInt(itemSnap.val().Count) === 3) {
                    console.log('Hi');
                    this.items = this.items.map(item => {
                      return item.filter(items =>
                        ((new Date(items.Date + " " + items.startTime)) <
                          startTime && (new Date(items.Date + " " + items.endTime)) <
                          startTime)
                        ||
                        ((new Date(items.Date + " " + items.startTime)) >
                          endTime)
                      )
                    })
                  }
                  if (parseInt(itemSnap.val().Count) === 2) {
                    console.log('Hi');
                    this.items = this.items.map(item => {
                      return item.filter(items =>
                        ((new Date(items.Date + " " + items.startTime)) <
                          startTime && (new Date(items.Date + " " + items.endTime)) <=
                          startTime)
                        || ((new Date(items.Date + " " + items.startTime)) >=
                          endTime) ||
                        ((new Date(items.Date + " " + items.startTime)) >=
                          startTime
                          && (new Date(items.Date + " " + items.startTime)) <
                          endTime && items.Carpool === 'Yes'
                          &&
                          items.PickupRegion === pickup
                          && items.DestinationRegion === destination && !items.Patient2Name
                        )
                      )
                    })
                  }
                  else {

                    this.items = this.items.map(item => {


                      return item.filter(items =>
                        ((new Date(items.Date + " " + items.startTime)) <
                          startTime && (new Date(items.Date + " " + items.endTime)) <=
                          startTime)
                        || ((new Date(items.Date + " " + items.startTime)) >=
                          endTime) ||
                        ((new Date(items.Date + " " + items.startTime)) >=
                          startTime
                          && (new Date(items.Date + " " + items.startTime)) <
                          endTime && items.Carpool === 'Yes'
                          &&
                          items.PickupRegion === pickup
                          && items.DestinationRegion === destination
                        )
                      )
                    })
                  }


                  return false;

                });


              }

            });
          }
        }
      }
    });

  }
  getItems(ev: any) {


    this.getInitialItems();
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.map(item => {

        return item.filter(items =>
          (items.Destination.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        )
      })
    }
  }




  // Filter() {
  //   this.buttonClicked = !this.buttonClicked;
  //   this.toggle = !this.toggle;
  //   this.DateClicked = false;
  //   this.PickUpClicked = false;
  //   this.visible = false;
  //   this.pickup = false;
  //   this.gender = false;
  //   this.GenderClicked = false;

  // }
  // Date() {
  //   if (this.DateClicked == false) {
  //     this.DateClicked = true;
  //     this.visible = true;
  //   }
  //   else {
  //     this.DateClicked = false;
  //     this.visible = false;
  //   }
  // }
  // Gender() {
  //   if (this.GenderClicked == false) {
  //     this.GenderClicked = true;
  //     this.gender = true;
  //   }
  //   else {
  //     this.GenderClicked = false;
  //     this.gender = false;
  //   }
  // }

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
  // setBadge(time) {
  //   this.timeMin2 = this.structure.lower;
  //   this.timeMax2 = this.structure.upper;
  // }
  // PickUp() {
  //   if (this.PickUpClicked == false) {
  //     this.PickUpClicked = true;
  //     this.pickup = true;
  //   }
  //   else {
  //     this.PickUpClicked = false;
  //     this.pickup = false;
  //   }
  // }

  // Filters() {
  //   this.items = this.itemsRef.snapshotChanges().map(changes => {
  //     return changes.map(c =>
  //       ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
  //         (items.Status === 'Pending' || items.Status === 'Cancelled') && items.Date >= this.today
  //       );
  //   });

  //   if (this.selectedDate) {
  //      console.log('Fly')
  //     let loading = this.loadingCtrl.create({
  //       content: 'Please wait...'
  //     });

  //     loading.present();

  //     setTimeout(() => {
  //       loading.dismiss();
  //     }, 2000);
  //     this.items = this.items.map(item => {
  //       return item.filter(items => items.Date === this.selectedDate)
  //     })
  //   }


  //   if (this.Genders === 'Female') {
  //     console.log('Hi')
  //     let loading = this.loadingCtrl.create({
  //       content: 'Please wait...'
  //     });

  //     loading.present();

  //     setTimeout(() => {
  //       loading.dismiss();
  //     }, 2000);
  //     this.female = false;
  //     this.male = true;
  //     this.items = this.items.map(item => {
  //       return item.filter(items => items.Gender === this.Genders)
  //     })
  //     this.Genders = null;
  //   }
  //   else if (this.Genders === 'Male') {
  //       console.log('Bye')
  //     let loading = this.loadingCtrl.create({
  //       content: 'Please wait...'
  //     });

  //     loading.present();

  //     setTimeout(() => {
  //       loading.dismiss();
  //     }, 2000);
  //     this.male = false;
  //     this.female = true;
  //     this.items = this.items.map(item => {
  //       return item.filter(items => items.Gender === this.Genders)
  //     })
  //     this.Genders = null;
  //   }
  //   else if (this.Genders === 'All') {
  //       console.log('Die')
  //     let loading = this.loadingCtrl.create({
  //       content: 'Please wait...'
  //     });

  //     loading.present();

  //     setTimeout(() => {
  //       loading.dismiss();
  //     }, 2000);
  //     this.male = true;
  //     this.female = true;
  //     this.Genders = null;
  //   }

  // }
  // FilterGender() {
  //   if (this.Genders) {
  //     this.Filters();
  //   }
  // }

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