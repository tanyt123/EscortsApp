import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Nav } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
import { SinglebookPage } from '../singlebook/singlebook';
export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}
@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
 public items:Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController,afDatabase: AngularFireDatabase) {
  
} 
gotoPage(i){
 this.navCtrl.push(SinglebookPage,{
   index:i
 });

}
 openMenu() {
   this.menuCtrl.open();
 }
  toggleMenu() {
   this.menuCtrl.toggle();
 }
  ionViewDidLoad() {
    this.itemRef.on('value', itemSnapshot => {
    this.items = [];
    itemSnapshot.forEach( itemSnap => {
      this.items.push(itemSnap.val());
      return false;
     
    });

  });

}

}
