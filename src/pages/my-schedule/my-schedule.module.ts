import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySchedulePage } from './my-schedule';

@NgModule({
  declarations: [
    MySchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(MySchedulePage),
  ],
})
export class MySchedulePageModule {}
