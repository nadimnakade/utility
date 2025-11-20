import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { DataTablesModule } from 'angular-datatables';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//import { CallLog } from 'plugins/cordova-plugin-calllog/ionic/call-log';

registerLocaleData(localeEnIn);

@NgModule({
  declarations: [
    AppComponent    
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    NgxDatatableModule, 
    HttpClientModule,
    DataTablesModule,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    AppUpdate,
    Device,
    AppVersion,
    HTTP,
    //CallLog,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
