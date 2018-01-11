import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar"
import { ModalController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-my-schedule',
  templateUrl: 'my-schedule.html',
})
export class MySchedulePage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySchedulePage');
    this.openCalendar();
  }
openCalendar() {
    let _daysConfig: DayConfig[] = [];
    for (let i = 0; i < 31; i++) {
      _daysConfig.push({
        date: new Date(2017, 0, i + 1),
        subTitle: `$${i + 1}`
      })
    }
 
    const options: CalendarModalOptions = {
      from: new Date(2017, 0, 1),
      to: new Date(2017, 11.1),
      daysConfig: _daysConfig
    };
 
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });
 
    myCalendar.present();
 
    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      console.log(date);
    });
  }
}
