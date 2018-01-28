import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { CropPage } from '../crop/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import Cropper from 'cropperjs';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {
  imgsource;
  @ViewChild('imageSrc') input: ElementRef;
  getCameraOptions() {
    // just an example working config
    let cameraOpts: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true
    }

    return cameraOpts;
  }
  public photos: any;
  public base64Image: string;
  cropInstance;
  imgCroppedUrl;
  imgUrl;
  Image;
  cropperInstance;
  isActiveToggleTextPassword;
  public cropper: Cropper;
  constructor(public navCtrl: NavController, private camera: Camera, public alertCtrl: AlertController, public navParams: NavParams, private modal: ModalController) {

  }

  public toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword === true) ? false : true;
  }
  public getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }



  public type = 'password';
  public showPass = false;


  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageCropperPage');
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,

    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.Image = imageData;
      // const myModal = this.modal.create(CropPage, { imageB64String: this.Image });
      // myModal.present();
      // myModal.onDidDismiss((croppedImgB64String) => {
      //   this.base64Image = croppedImgB64String;

      // })
    }, (err) => {
      console.log(err);
    });
  }
  openModal() {
    console.log(this.base64Image);


  }
  display() {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child('images/${filename}.jpg');
    imageRef.getDownloadURL().then((url) => {
      console.log(url);
      this.imgsource = url;

    })
  }

  Upload() {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child('images/${filename}.jpg');
    imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      console.log(snapshot.downloadURL);
      //  firebase
      //         .database()
      //         .ref(`users/user1/profilePicture`)
      //         .set(snapshot.downloadURL);

      //       this.showSuccesfulUploadAlert();
    });
  }
  showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      title: 'Uploaded!',
      subTitle: 'Picture is uploaded to Firebase',
      buttons: ['OK']
    });
    alert.present();

    // clear the previous photo data in the variable
    this.base64Image = "";
  }
}
  // cropImage() {
  //   this.cropperInstance = new Cropper(this.imageElement.nativeElement, {
  //     aspectRatio: 16 / 9,
  //     crop: function (e) {
  //       console.log(e.detail.x);
  //       console.log(e.detail.y);
  //       console.log(e.detail.width);
  //       console.log(e.detail.height);
  //       console.log(e.detail.rotate);
  //       console.log(e.detail.scaleX);
  //       console.log(e.detail.scaleY);
  //     }
  //   });
  // }


