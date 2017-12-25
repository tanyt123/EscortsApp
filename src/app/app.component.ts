import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RegistrationPage } from '../pages/registration/registration';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { BookingPage } from '../pages/booking/booking';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';
import { SinglebookPage } from '../pages/singlebook/singlebook';
import { MenuController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { UpdateprofilePage } from '../pages/updateprofile/updateprofile';
import { ReauthenticatePage } from '../pages/reauthenticate/reauthenticate';
import { SchedulePage } from '../pages/schedule/schedule';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  activePage: any;
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any }>;
  constructor(platform: Platform, statusBar: StatusBar, private afAuth: AngularFireAuth, splashScreen: SplashScreen, private camera: Camera, public menuCtrl: MenuController) {
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      this.afAuth.authState.subscribe(auth => {
        if (!auth)
          this.rootPage = BookingPage;
        else
          this.rootPage = BookingPage;
      });
      this.pages = [
        { title: 'Profile', component: ProfilePage },
        { title: 'Bookings', component: BookingPage },
         { title: 'MySchedule', component: SchedulePage },
        { title: 'Logout', component: null },
      ];
      this.activePage = this.pages[1];
    });

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component) {
      this.nav.setRoot(page.component);
      this.activePage = page;
    }
    else {

      this.nav.setRoot(HomePage);
    }
  }
  checkActive(page) {
    return page == this.activePage;
  }
  Logout() {
    this.menuCtrl.close();
    this.nav.setRoot(HomePage);
  }
}

