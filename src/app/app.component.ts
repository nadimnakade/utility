import { Component } from '@angular/core';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Routes, RouterModule, Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate : any;
  AppVersion: any;
  interval = 30000;
  isDarkMode = false;
  //filters: CallLogObject[];
  objCallLogs = new CallLogList();
  lstCallLogs = new Array<CallLogList>();
  lstCallLog = new Array<CallLogList>();


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private appUpdate: AppUpdate,
    private appVersion: AppVersion, 
    private httpC:HttpClient,
    // private CallLog: CallLog,
    // private callLog: CallLog, 
    private androidPermissions: AndroidPermissions
  )
    {
    localStorage.setItem('theme', 'light');
    this.sideMenu();
    this.initializeApp();
    this.checkPermissions();
    this.applySavedTheme();
  }

  checkPermissions(): void {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_CALL_LOG).then(
      success => {
        console.log('Permission granted to read call logs');
        //this.getContacts("type", "1", "==");
        //this.getContacts("type", "2", "==");
      },
      err => {
        console.log('Permission not granted. Requesting...');
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_CALL_LOG).then(
          success => {            
            //this.getContacts("type", "1", "==");
            //this.getContacts("type", "2", "==");
          },
          err => {
            console.log('Permission denied');
          }
        );
      }
    );
  }


  // async getContacts(name, value, operator) {
  //   var today = new Date();
  //   var yesterday = new Date(today);
  //   yesterday.setDate(today.getDate() - 1);
  //   var fromTime = yesterday.getTime();

  //   this.filters = [{
  //     name: name,
  //     value: value,
  //     operator: operator,
  //   }, {
  //     name: "date",
  //     value: localStorage.getItem("LastLoggedTime") == "" ? fromTime.toString() : localStorage.getItem("LastLoggedTime").toString(),
  //     operator: ">=",
  //   }];

  //   this.CallLog.getCallLog(this.filters).then(results => {
  //     this.lstCallLog = (results);
  //     var lastLoggedTime = today.getTime();
      

  //     this.lstCallLog = this.lstCallLog.map(log => {
  //       // Assuming log has a property 'timestamp' or similar to represent epoch time
  //       if (log.date) {
  //         log.date = this.convertEpochToDate(log.date);
  //       }
  //       return log;
  //     });
  //     localStorage.setItem("LastLoggedTime", lastLoggedTime.toString());

  //     let params = new HttpParams();
  //     params = params.append("CallLog", JSON.stringify(this.lstCallLog));
  //     params = params.append('UserKey', localStorage.getItem('UserKey'));
  //     this.httpC.post("https://1up.co.in/DialerAPI/api/UpdateStatus/FnSaveCallLogsAll", params).subscribe(data => { });
  //   });
  // }

  // Function to convert epoch timestamp to dd/mm/yyyy hh:mm:ss.sss
  convertEpochToDate(epoch: number): string {
    const date = new Date(epoch);

    // Extract the date parts
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const year = date.getFullYear();
    
    // Extract the time parts
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    // Return the formatted date string
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }


  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();

        this.appVersion.getVersionNumber().then(version => {
          this.AppVersion = version;
          const updateUrl = 'https://1up.co.in/1up_api/utilities.xml';
          this.appUpdate.checkAppUpdate(updateUrl).then(() => { console.log('App Update') });
        })

      }, 3000);
      
    });
    
    if (localStorage.getItem("IsLoggedIn") == "true") {
      this.router.navigate(['/dashboard'])
    }
    else {
      this.router.navigate(['/login'])
    }
  }

  applySavedTheme() {
    this.isDarkMode = false;
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  setDarkMode(enabled: boolean) {
    this.isDarkMode = false;
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  sideMenu()
  {
    this.navigate =
    [
      {
        title : "Home",
        url   : "/dashboard",
        icon  : "home"
      },
      {
        title : "Company Category",
        url   : "/companycategory",
        icon  : "business"
      },
      {
        title : "Emi",
        url   : "/emi",
        icon  : "calculator"
      },
      {
        title : "Offer",
        url   : "/offer",
        icon  : "gift"
      },
      {
        title: "Rewards",
        url: "/spinwheel",
        icon: "trophy"
      }
    ]
  }
}

class CallLogList {
  date?: any;
  number?: any;
  name?: any;
  type?: any;
  duration?: any;
  userkey?: any;
}