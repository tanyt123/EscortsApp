import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { SinglebookPage } from '../singlebook/singlebook';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Events } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  history;
  email;
  items: Observable<any[]>;
  cancelled: Observable<any[]>;
  itemsRef: AngularFireList<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, afDatabase: AngularFireDatabase) {
    this.itemsRef = afDatabase.list('Bookings',
      ref => ref.orderByChild('Time')
    );

  }
  ionViewDidLeave() {
    localStorage.removeItem('History');
  }
  ionViewDidLoad() {
    var alerted = localStorage.getItem('History') || '';
    if (alerted === 'cancelled') {
      this.history = "cancelled";

    }

    else if (!alerted) {
      this.history = "completed";
    }

console.log(this.history);
    this.email = window.sessionStorage.getItem('Email');
    console.log('ionViewDidLoad HistoryPage');
    this.getInitialItems();
  }
  getInitialItems() {
    
    this.items = this.itemsRef.snapshotChanges().map(changes => {

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === 'Completed') && items.Driver === this.email);
    });
    this.cancelled = this.itemsRef.snapshotChanges().map(changes => {

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === 'Cancelled') && items.Driver === this.email);
    });


  }
  gotoPage(key) {
    console.log(key);
    this.navCtrl.push(SinglebookPage, {
      key: key,
      Status: 'Cancelled'
    });

  }
}
