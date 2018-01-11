


import { AddEventPage } from '../add-event/add-event';
  import { RequestPage } from '../request/request';
import { Calendar } from '@ionic-native/calendar';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Refresher, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { SinglebookPage } from '../singlebook/singlebook';
import { Observable } from 'rxjs/Observable';
import { FiltersPage } from '../filters/filters';
import 'rxjs/add/operator/map'
import { ModalController } from 'ionic-angular';
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html'
})
export class BookingPage {
  dates;
  daysInThisMonth: any;
  daysInLastMonth: any;
date;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate = new Date().getDate();
  eventList: any;
 today = new Date().toJSON().split('T')[0];
  selectedEvent: any;
  isSelected: any;
  items: Observable<any[]>;
  public times: Array<any> = [];
  itemsRef: AngularFireList<any>;
  constructor(private alertCtrl: AlertController,
    public navCtrl: NavController,
    private calendar: Calendar) { }

  ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // this.getDaysOfMonth();
    console.log(new Date())
  }   
  onChange($event) {
   
   this.dates = $event.format().split('T')[0];
  console.log(this.dates);
  }

  // getDaysOfMonth() {
  //   this.daysInThisMonth = new Array();
  //   this.daysInLastMonth = new Array();
  //   this.daysInNextMonth = new Array();
  //   this.currentMonth = this.monthNames[this.date.getMonth()];
  //   this.currentYear = this.date.getFullYear();
  //   var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
  //   var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
  //   for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
  //     this.daysInLastMonth.push(i);
  //   }

  //   var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
  //   for (var j = 0; j < thisNumOfDays; j++) {
  //     this.daysInThisMonth.push(j + 1);
  //   }

  //   var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
  //   // var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
  //   for (var k = 0; k < (6 - lastDayThisMonth); k++) {
  //     this.daysInNextMonth.push(k + 1);
  //   }
  //   var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
  //   if (totalDays < 36) {
  //     for (var l = (7 - lastDayThisMonth); l < ((7 - lastDayThisMonth) + 7); l++) {
  //       this.daysInNextMonth.push(l);
  //     }
  //   }
  // }

  // goToLastMonth() {
  //   this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
  //   this.getDaysOfMonth();
  //   this.currentDate = null;
  // }

  // goToNextMonth() {
  //   this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
  //   this.getDaysOfMonth();
  //   this.currentDate = null;
  // }

  // addEvent() {
  //   this.navCtrl.push(AddEventPage);
  // }

  // // loadEventThisMonth() {
  // //   this.eventList = new Array();
  // //   var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  // //   var endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  // //   this.calendar.listEventsInRange(startDate, endDate).then(
  // //     (msg) => {
  // //       msg.forEach(item => {
  // //         this.eventList.push(item);
  // //       });
  // //     },
  // //     (err) => {
  // //       console.log(err);
  // //     }
  // //   );
  // // }

  // checkEvent(day) {
  //   var hasEvent = false;
  //   var thisDate1 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 00:00:00";
  //   var thisDate2 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 23:59:59";

  //   return hasEvent;
  // }

  // selectDate(day) {

  //   this.isSelected = false;
  //   this.selectedEvent = new Array();
  //   var thisDate1 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 00:00:00";
  //   console.log(thisDate1);
  //   var thisDate2 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 23:59:59";
  //   this.currentDate = day;
  // }
  selectedDate() {
  
 this.navCtrl.push(RequestPage, {
    date: this.dates
});
  }

}

