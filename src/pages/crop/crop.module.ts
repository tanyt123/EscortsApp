import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropPage } from './crop';

@NgModule({
  declarations: [
    CropPage,
  ],
  imports: [
    IonicPageModule.forChild(CropPage),
  ],
})
export class CropPageModule {}
