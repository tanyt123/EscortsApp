import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Refresher } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { SinglebookPage } from '../singlebook/singlebook';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

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
  itemsRef: AngularFireList<any>;
  selectedDate: string = new Date().toJSON().split('T')[0];
 today = new Date().toJSON().split('T')[0];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public menuCtrl: MenuController, afDatabase: AngularFireDatabase) {
    this.itemsRef = afDatabase.list('Bookings',
      ref => ref.orderByChild('startTime'));
    this.items = this.itemsRef.snapshotChanges().map(changes => {

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          items.Status === '' || items.Status === 'Cancelled'
        );
    });

  }
  Filter() {
    this.items = this.itemsRef.snapshotChanges().map(changes => {

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === '' || items.Status === 'Cancelled') && items.Gender === 'Female'
        );
    });

  }

  gotoPage(key) {
 
    this.navCtrl.push(SinglebookPage, {
      key: key
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
