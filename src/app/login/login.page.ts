import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import {  NavController, AlertController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  ngOnInit(){

  }
  
  registerCredentials = { email: '', password: '', mobileno: '' };
  mobileno: string;
  versionInfo: any;
  UserName: string;
  Password: string;
  deviceid: any;
  EmployeeDtl: any;


  constructor(public nav: NavController,
    private splashScreen: SplashScreen,    
    public httpC: HttpClient,
    private device: Device,
    private appversionInfo: AppVersion
  )
  {    
    this.appversionInfo.getVersionNumber().then(version => {
      this.versionInfo = version;
    });
  }

  

  login() {

    const params = new HttpParams();
    params.set('MobileNo', this.mobileno);
    params.set('UDID', this.device.uuid);
    params.set('Type', 'Validate');
    const httpOptions = {
      headers: new HttpHeaders(
        { 'Content-Type': 'application/json' },
      )
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    if (this.device.uuid != undefined && this.device.uuid != null) {
      this.deviceid = this.device.uuid;
    }
    else {
      this.deviceid = Math.floor(1000000 + Math.random() * 8000000);

    }

    var parameter = {
      "UserName": this.UserName.toString(),
      "Password": this.Password.toString(),
      "UUID": this.deviceid,
      "Type": localStorage.getItem('PushToken')
    }


    var url = "https://1up.co.in/1up_api/api/UpdateStatus/ValidateLogin";
    //this.httpC.setSSLCertMode('nocheck')
    this.httpC.get(url,
      { params: parameter }
    ).subscribe(res => {
      this.EmployeeDtl = res[0];
      if (res != null && this.EmployeeDtl.Key > 0) {
        localStorage.setItem('IsLoggedIn', 'true')
        localStorage.setItem('UDID', this.deviceid);
        localStorage.setItem('MobileNo', this.mobileno);
        localStorage.setItem('UserSession', JSON.stringify(this.EmployeeDtl))
        localStorage.setItem('UserKey', this.EmployeeDtl.Key);
        localStorage.setItem('EmployeeName', this.EmployeeDtl.EmployeeName);
        localStorage.setItem('MobileNo', this.EmployeeDtl.OfficeContactNo);

        this.splashScreen.show();
        location.reload();
        
      }
      else
      {
        window.alert('Error While logging!')
      }
    });    
  }


  

}
