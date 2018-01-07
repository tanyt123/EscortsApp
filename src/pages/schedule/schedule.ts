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

/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  items: Observable<any[]>;
  itemsRef: AngularFireList<any>;
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
  DateClicked: boolean = false;
  public buttonClicked: boolean = false;
  toggle: boolean = true;
  name;
  selectedDate;
  today = new Date().toJSON().split('T')[0];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public menuCtrl: MenuController, afDatabase: AngularFireDatabase, public modalCtrl: ModalController) {
    this.itemsRef = afDatabase.list('Bookings',
      ref => ref.orderByChild('startTime')
    );
    var email = window.localStorage.getItem('Email');
    console.log(email);
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          items.Driver === email && items.Status === 'Accepted');
    });

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
  Filters() {
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          (items.Status === 'Accepted') && items.Driver === this.name && items.Date >= this.today
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



  }
  gotoPage(key) {

    this.navCtrl.push(SinglebookPage, {
      key: key,
      Status: 'Accepted'
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
    this.selectedDate = this.today;
    this.items = this.items.map(item => {
      return item.filter(items => items.Date === this.selectedDate)
    })
  }

}
