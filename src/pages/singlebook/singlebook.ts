import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PickerColumnOption } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-singlebook',
  templateUrl: 'singlebook.html',
})
export class SinglebookPage {
  public index;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  public itemRefs: firebase.database.Reference = firebase.database().ref('Bookings');
  ionViewDidLoad() {
    this.index = this.navParams.get('index');
    this.itemRef.on('value', itemSnapshot => {
      
    

        var key = Object.keys(itemSnapshot.val())[this.index];
        this.itemRef.child(key).on('value', itemkeySnapshot => {
        this.items.push( itemkeySnapshot.val());
     
        });

        return false;

      });


   

  }
}




