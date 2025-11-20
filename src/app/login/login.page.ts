import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import { NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

// --- Type Safety Interfaces ---
interface LoginPayload {
  UserName: string;
  Password: string;
  UUID: string | number;
  Type: string | null;
}

interface EmployeeDetails {
  Key: number;
  EmployeeName: string;
  OfficeContactNo: string;
  // Add more properties from your API response if needed
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // API URLs
  private readonly apiUrl = 'https://1up.co.in/1up_api/api/UpdateStatus/ValidateLogin';
  private readonly apiUrlFallback = 'https://1up.co.in/1up_api/api/UpdateStatus/ValidateLogin';

  // Component fields
  mobileno: string = '';
  versionInfo: string = '';
  UserName: string = '';
  Password: string = '';
  deviceid: string | number = '';
  EmployeeDtl: EmployeeDetails | null = null;

  constructor(
    private nav: NavController,
    private splashScreen: SplashScreen,
    private httpC: HttpClient,
    private device: Device,
    private appversionInfo: AppVersion,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private nativeHttp: HTTP
  ) {
    this.appversionInfo.getVersionNumber().then(version => {
      this.versionInfo = version;
    });
  }

  ngOnInit() {
    // Any init logic
  }

  // =======================
  //  LOGIN
  // =======================
  async login(): Promise<void> {
    const loader = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'crescent',
    });
    await loader.present();

    // Device ID
    this.deviceid = this.device.uuid
      ? this.device.uuid
      : Math.floor(1000000 + Math.random() * 8000000);

    const payload: LoginPayload = {
      UserName: this.UserName,
      Password: this.Password,
      UUID: this.deviceid,
      Type: localStorage.getItem('PushToken') || 'testing',
    };

    console.log('Login payload:', payload);

    const isNative =
      this.platform.is('cordova') ||
      this.platform.is('capacitor') ||
      this.platform.is('hybrid');

    // -----------------------------
    // 1) BROWSER → HttpClient GET with query string
    // -----------------------------
    if (!isNative) {
      const params = new HttpParams()
        .set('UserName', payload.UserName)
        .set('Password', payload.Password)
        .set('UUID', String(payload.UUID))
        .set('Type', payload.Type || '');

      const url = `${this.apiUrl}?${params.toString()}`;

      this.httpC.get<EmployeeDetails[]>(url)
        .subscribe({
          next: (res: EmployeeDetails[]) => {
            loader.dismiss();
            const employeeDtl = res?.[0];
            if (employeeDtl && employeeDtl.Key > 0) {
              this.handleSuccessfulLogin(employeeDtl);
            } else {
              this.handleLoginError('Invalid credentials or no employee data returned.');
            }
          },
          error: (err) => {
            loader.dismiss();
            console.error('HttpClient error:', err);
            const msg = this.buildErrorMessage(err);
            this.handleLoginError(msg || 'Request failed');
          }
        });

      return;
    }

    // -----------------------------
    // 2) DEVICE / APK → Native HTTP GET with params
    // -----------------------------
    try {
      const nativeParams = {
        UserName: payload.UserName,
        Password: payload.Password,
        UUID: String(payload.UUID),
        Type: payload.Type || '',
      };

      const nativeResponse = await this.nativeHttp.get(
        this.apiUrl,
        nativeParams, // will be converted to ?UserName=...&Password=...
        {}            // headers if needed
      );

      console.log('Native HTTP response:', nativeResponse);

      const res: EmployeeDetails[] = JSON.parse(nativeResponse.data);
      loader.dismiss();

      const employeeDtl = res?.[0];
      if (employeeDtl && employeeDtl.Key > 0) {
        this.handleSuccessfulLogin(employeeDtl);
      } else {
        this.handleLoginError('Invalid credentials or no employee data returned.');
      }
    } catch (err) {
      loader.dismiss();
      console.error('Native HTTP error:', err);
      const msg = this.buildNativeErrorMessage(err);
      this.handleLoginError(msg || 'Request failed (native HTTP)');
    }
  }



  // =======================
  //  SUCCESS HANDLER
  // =======================
  private handleSuccessfulLogin(employeeDtl: EmployeeDetails): void {
    localStorage.setItem('IsLoggedIn', 'true');
    localStorage.setItem('UDID', String(this.deviceid));
    localStorage.setItem('MobileNo', employeeDtl.OfficeContactNo);
    localStorage.setItem('UserSession', JSON.stringify(employeeDtl));
    localStorage.setItem('UserKey', String(employeeDtl.Key));
    localStorage.setItem('EmployeeName', employeeDtl.EmployeeName);

    this.splashScreen.show();
    // You can change this to proper navigation if you want:
    // this.nav.navigateRoot(['/home']);
    location.reload();
  }

  // =======================
  //  ERROR HANDLING
  // =======================
  private async handleLoginError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private buildErrorMessage(err: any): string {
    const serverMsg = typeof err?.error === 'string'
      ? err.error
      : (err?.error?.Message || err?.error?.message || err?.statusText || '');
    return `Error ${err?.status || ''} ${err?.statusText || ''}${serverMsg ? ': ' + serverMsg : ''}`.trim();
  }

  private buildNativeErrorMessage(err: any): string {
    const status = err?.status;
    const statusText = err?.statusText || '';
    let serverMsg = '';

    if (err?.error) {
      try {
        const e = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
        serverMsg = e?.Message || e?.message || '';
      } catch {
        serverMsg = err.error;
      }
    }

    return `Error ${status || ''} ${statusText}${serverMsg ? ': ' + serverMsg : ''}`.trim();
  }
}
