import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReauthenticatePage } from './reauthenticate';

@NgModule({
  declarations: [
    ReauthenticatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReauthenticatePage),
  ],
})
export class ReauthenticatePageModule {}
