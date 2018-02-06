import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
declare var google: any;
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HistoryPage } from '../history/history';
import { Events } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
@Component({
  selector: 'page-tracker',
  templateUrl: 'tracker.html',
})
export class TrackerPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  items: Observable<any[]>;
  email;
  Address;
  postal;
  key;
  array = [];
  visible: boolean = true;
  value: boolean = false;
  markers = [];
  ref = firebase.database().ref('geolocations/');
  itemsRef: AngularFireList<any>;
  public itemRef: firebase.database.Reference;

  dest;
  constructor(public navCtrl: NavController, private nativeGeocoder: NativeGeocoder,
    public platform: Platform, public alertCtrl: AlertController,
    private geolocation: Geolocation, afDatabase: AngularFireDatabase, public events: Events,
    private device: Device) {


    this.platform.ready().then(() => {
      this.initMap();
    });

    this.itemsRef = afDatabase.list('Bookings',
      ref => ref.orderByChild('startTime')
    );
    this.email = window.sessionStorage.getItem('Email');
    this.items = this.itemsRef.snapshotChanges().map(changes => {

      return changes.map(c =>
        ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
          items.Driver === this.email && items.Status === 'Ongoing');
    });
    this.items.subscribe(x => {
      this.array = x;
      console.log(this.array);
      if (this.array.length > 0) {
        this.visible = true;
        this.value = false;
        console.log(this.visible);
      }
      else {
        this.visible = false;
        this.value = true;
        console.log(this.visible);
      }
    }
    );


    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if (data.uuid !== this.device.uuid) {
          let image = 'assets/imgs/black.png';
          let updatelocation = new google.maps.LatLng(data.latitude, data.longitude);
          this.nativeGeocoder.reverseGeocode(data.latitude, data.longitude)
            .then((result: NativeGeocoderReverseResult) => (JSON.stringify(result.postalCode))




            )
            .catch((error: any) => console.log(error));
          this.addMarker(updatelocation, image);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/blue.png';
          let updatelocation = new google.maps.LatLng(data.latitude, data.longitude);
          this.addMarker(updatelocation, image);
          this.setMapOnAll(this.map);
        }
      });
    });
  }
ionViewDidLoad(){ 

  
   google.maps.event.trigger( this.map, 'resize' );


}

  initMap() {
    console.log("hi");
    this.geolocation.getCurrentPosition().then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      console.log(data);
      this.updateGeolocation(this.device.uuid, data.coords.latitude, data.coords.longitude);
      this.nativeGeocoder.reverseGeocode(data.coords.latitude, data.coords.longitude)
        .then((result: NativeGeocoderReverseResult) => {

          this.dest = result.postalCode;
          this.itemsRef.snapshotChanges().map(changes => {
            return changes.map(c =>
              ({ key: c.payload.key, ...c.payload.val() })).filter(items =>
                items.Driver === this.email && items.Status === 'Ongoing');
          }).subscribe(time => {
            var schedules = [];

            schedules = time;
            console.log(schedules);
            for (var i = 0; i < schedules.length; i++) {
              this.key = schedules[i].key;
              this.itemRef = firebase.database().ref('Bookings/' + this.key);
              this.Address = schedules[i].Destination;
              this.postal = this.Address.substr(this.Address.length - 6);
              console.log(this.dest);
              console.log(this.postal);
              if (this.dest === this.postal) {
                var alerted = localStorage.getItem('alerted') || '';
                if (alerted != 'yes') {
                  let alert = this.alertCtrl.create({
                    title: 'Destination Reached!',
                    buttons: [
                      {
                        text: 'OK',
                        handler: data => {
                          this.itemRef.update({
                            Status: "Completed",
                            CompletedAt: firebase.database.ServerValue.TIMESTAMP,
                          });
                          localStorage.setItem('History', 'completed');
                          this.events.publish('History');
                          this.navCtrl.push(HistoryPage);
                          this.navCtrl.setRoot(HistoryPage).then(() => {
                            this.navCtrl.popToRoot();

                          });
                        }
                      }
                    ],

                  });
                  alert.present();
                  localStorage.setItem('alerted', 'yes');
                }

              }
            }
          });

        })

        .catch((error: any) => console.log(error));
      let updatelocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      let image = 'assets/imgs/blue.png';
      this.addMarker(updatelocation, image);
      this.setMapOnAll(this.map);
    });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  updateGeolocation(uuid, lat, lng) {
    if (localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/' + localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};