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
    this.imageB64Tagged = "data:image/jpeg;base64," + this.imageB64;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CropPage');
  }
  imageLoaded() {
    console.log("starting Cropper... ");
    this.cropper = new Cropper(this.input.nativeElement, {
      aspectRatio: 1 / 1,
      viewMode: 1,
      modal: true,
      guides: true,
      highlight: false,
      background: true,
      autoCrop: true,
      autoCropArea: 0.9,
      responsive: true,
      cropBoxResizable : false,
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

  getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;

    context.imageSmoothingEnabled = true;
    context.strokeStyle = 'orange';
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();

    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);

    context.fill();

    return canvas;
  }
  finish() {
    var croppedCanvas;
    var roundedCanvas;
    var roundedImage;

    croppedCanvas = this.cropper.getCroppedCanvas({ fillColor: '#f53d3d', });
    let croppedImgB64String: string = this.getRoundedCanvas(croppedCanvas).toDataURL('image/jpeg', (90 / 100));
    this.viewCtrl.dismiss(croppedImgB64String);

  }
}
