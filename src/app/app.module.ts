import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MyApp } from './app.component';
import { RegistrationPage } from '../pages/registration/registration';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { SMS } from '@ionic-native/sms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { BookingPage } from '../pages/booking/booking';
import { ProfilePage } from '../pages/profile/profile';
import { SinglebookPage } from '../pages/singlebook/singlebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { UpdateprofilePage } from '../pages/updateprofile/updateprofile';
import {ReauthenticatePage} from '../pages/reauthenticate/reauthenticate';
import { SchedulePage } from '../pages/schedule/schedule';
import { FiltersPage } from '../pages/filters/filters';
import { ResetPage } from '../pages/reset/reset';
import { MobilePage } from '../pages/mobile/mobile';
import { NgxPhoneSelectModule } from 'ngx-phone-select';
import { TextMaskModule } from 'angular2-text-mask';
export const firebaseConfig = {
  apiKey: "AIzaSyCFU9g3inPp81yQU14fYANC7vf31SpkqKk",
  authDomain: "sharedmedicalfyp-1cfcf.firebaseapp.com",
  databaseURL: "https://sharedmedicalfyp-1cfcf.firebaseio.com",
  projectId: "sharedmedicalfyp-1cfcf",
  storageBucket: "",
  messagingSenderId: "865840865908"
};


@NgModule({
  declarations: [
    MyApp,
    RegistrationPage,
    LoginPage,
    HomePage,
    BookingPage,
    ProfilePage,
    SinglebookPage,
    UpdateprofilePage,
    ReauthenticatePage,
    SchedulePage,
    FiltersPage,
    ResetPage,
    MobilePage
  ],
  imports: [
    BrowserModule,
     TextMaskModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    NgxPhoneSelectModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegistrationPage,
    LoginPage,
    HomePage,
    BookingPage,
    ProfilePage,
    SinglebookPage,
    UpdateprofilePage,
    ReauthenticatePage,
    SchedulePage  ,
    FiltersPage,
    ResetPage,
    MobilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    NativeStorage,
    Transfer,
    Camera,
    FilePath,
    SMS,
    AngularFireDatabaseModule,
    { provide: ErrorHandler, useClass: IonicErrorHandler },

  ]
})
export class AppModule { }
