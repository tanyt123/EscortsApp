import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalOptions } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import firebase from 'firebase';
import { FormsModule } from "@angular/forms";
import { FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ViewChild } from '@angular/core'
import { UpdateprofilePage } from '../updateprofile/updateprofile';
import { Navbar } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';
import { ModalController} from 'ionic-angular';
import { ReauthenticatePage} from '../reauthenticate/reauthenticate';
import { AngularFireAuthModule, AngularFireAuth, AngularFireAuthProvider, AUTH_PROVIDERS } from 'angularfire2/auth';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild(Navbar) navBar: Navbar;
  myForm: FormGroup;
  public ages: string;
  public AgeError: boolean = false;
  isenabled: boolean = false;
  public date;
  public key;
  changeDate = '';
  correct_data;
  public myDate: string;
  private currentUser: firebase.User;
  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, public navParams: NavParams, public alertCtrl: AlertController
    , private nativeStorage: NativeStorage, public modalCtrl: ModalController,public formBuilder: FormBuilder) {


  }

  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('Escorts');
  public itemsRef: firebase.database.Reference;
  ionViewDidLoad() {

    console.log('ionViewDidLoad ProfilePage');
    this.items = [];

    //  var appData = window.localStorage.getItem('email');
  console.log(this.key);
    var appData = "tanyongting1234@gmail.com";
    this.itemRef.orderByChild("Email").equalTo(appData).once('value', (snap) => {
      this.key = Object.keys(snap.val());
      snap.forEach(itemSnap => {
        this.items.push(itemSnap.val());
        this.date = itemSnap.child("DOB").val();
        return false;

      });
      this.myDate = this.date;
      this.itemsRef = firebase.database().ref('Escorts/' + this.key);
    
    });

  }
  Update() {
    this.navCtrl.push(UpdateprofilePage);
  }
  Delete() {
    const myModalOptions: ModalOptions ={
     enableBackdropDismiss : false
    };
const myModal = this.modalCtrl.create(ReauthenticatePage);
myModal.present();
    console.log(this.key);
    var user = firebase.auth().currentUser;

    let alert = this.alertCtrl.create({
      message: "ReEnter Credentials.",
      cssClass: 'buttonCss',
      inputs: [
        {
          name: 'Email',
          placeholder: 'Email'

        },
        {
          name: 'Password',
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'OK',
          cssClass: 'buttonOkCss',
          handler: data => {
            var cred = firebase.auth.EmailAuthProvider.credential(
              data.Email,
              data.Password
            );
            user.reauthenticateWithCredential(cred).then(() => {
              user.delete().then(() => {

                this.itemsRef.remove();

                let alert = this.alertCtrl.create({
                  message: "User deleted.",
                  buttons: [
                    {
                      text: 'OK',
                        cssClass: 'buttonOkCss',
                        
                      handler: data => {
                        this.navCtrl.push(HomePage);
                        this.navCtrl.setRoot(HomePage);

                      }
                    }
                  ],
                });
                alert.present();
              }).catch(function (error) {
                console.log(error);
              });
            }).catch(function (error) {
              console.log(error);
            });
         

          },

        }, {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });

    alert.present();


  }

}









