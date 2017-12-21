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
  isenabled: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Bookings');
  public itemRefs: firebase.database.Reference;
  ionViewDidLoad() {
    var appData = window.localStorage.getItem('name');
    this.index = this.navParams.get('index');
    this.itemRef.on('value', itemSnapshot => {
      var key = Object.keys(itemSnapshot.val())[this.index];
      this.itemRef.child(key).on('value', itemkeySnapshot => {
        this.items.push(itemkeySnapshot.val());
        console.log(this.items);
      });
      this.itemRefs = firebase.database().ref('Bookings/' + key);
      return false;

    });




  }
  Accept() {
    try {
      this.isenabled = false;
      this.itemRefs.update({

      })
    }
    catch (e) {
      console.log(e);

    }
  }
}




