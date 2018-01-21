import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import Cropper from 'cropperjs';

@IonicPage()
@Component({
  selector: 'page-crop',
  templateUrl: 'crop.html',
})
export class CropPage {
  @ViewChild('imageSrc') input: ElementRef;

  public photos: any;
  public base64Image: string;
  cropInstance;
  imgCroppedUrl;
  imgUrl;
  cropperInstance;
  imageB64;
  imageB64Tagged;
  private cropper: Cropper;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.imageB64 = this.navParams.get("imageB64String");
      this.input.nativeElement = "data:image/jpeg;base64,"+this.imageB64;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CropPage');
  }
  imageLoaded() {
    console.log("starting Cropper... ");
    this.cropper = new Cropper(this.input.nativeElement, {
      aspectRatio: 1 / 1,
      viewMode : 2,
      movable: true,
      zoomable: true,
      crop: function (e) {
        console.log(e.detail.x);
        console.log(e.detail.y);
      }
    });
  }

  imageRotate() {
    this.cropper.rotate(90);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  finish() {
    let croppedImgB64String: string = this.cropper.getCroppedCanvas({
      width: 500,
      height: 500
    }).toDataURL('image/jpeg', (90 / 100)); // 90 / 100 = photo quality
    this.viewCtrl.dismiss(croppedImgB64String);
  }
}
