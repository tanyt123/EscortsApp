import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinglebookPage } from './singlebook';

@NgModule({
  declarations: [
    SinglebookPage,
  ],
  imports: [
    IonicPageModule.forChild(SinglebookPage),
  ],
})
export class SinglebookPageModule {}
