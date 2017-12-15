import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage'; 
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage) {
  }
    public items: Array<any> = [];
 public itemRef: firebase.database.Reference = firebase.database().ref('Escorts');
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
 var appData = window.localStorage.getItem( 'app-name' );
 this.itemRef.on('value', itemSnapshot => {
        this.items = [];
  
 this.items.push(itemSnapshot.val());
    
     console.log(this.items);
        });

        return false;

  }

}
