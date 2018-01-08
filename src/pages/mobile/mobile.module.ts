import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobilePage } from './mobile';

@NgModule({
  declarations: [
    MobilePage,
  ],
  imports: [
    IonicPageModule.forChild(MobilePage),
  ],
})
export class MobilePageModule {}
