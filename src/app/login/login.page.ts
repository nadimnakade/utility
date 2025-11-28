import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Device } from '@ionic-native/device/ngx';
import { NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
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
  private readonly apiUrl = `${environment.apiUrl}/UpdateStatus/ValidateLogin`;
  private readonly apiUrlFallback = `${environment.apiUrl}/UpdateStatus/ValidateLogin`;
  private readonly apiUrlDialer = `https://1up.co.in/DialerAPI/api/UpdateStatus/ValidateLogin`;

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
    // remove native HTTP and use HttpClient everywhere
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
    console.log('API URL:', this.apiUrl);

    // Build form-urlencoded body (like Postman x-www-form-urlencoded)
    const body = new HttpParams()
      .set('UserName', payload.UserName)
      .set('Password', payload.Password)
      .set('UUID', String(payload.UUID))
      .set('Type', payload.Type || 'testing')
      .toString();

    this.httpC.post<EmployeeDetails[]>(this.apiUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }),
    })
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
          const status = err?.status;
          if (status === 404) {
            const params = new HttpParams()
              .set('UserName', payload.UserName)
              .set('Password', payload.Password)
              .set('UUID', String(payload.UUID))
              .set('Type', payload.Type || 'testing');

            this.httpC.get<EmployeeDetails[]>(this.apiUrl, { params, headers: new HttpHeaders({ 'Accept': 'application/json' }) })
              .subscribe({
                next: (res2: EmployeeDetails[]) => {
                  loader.dismiss();
                  const employeeDtl = res2?.[0];
                  if (employeeDtl && employeeDtl.Key > 0) {
                    this.handleSuccessfulLogin(employeeDtl);
                  } else {
                    this.handleLoginError('Invalid credentials or no employee data returned.');
                  }
                },
                error: (err2) => {
                  const status2 = err2?.status;
                  if (status2 === 404) {
                    this.httpC.get<EmployeeDetails[]>(this.apiUrlDialer, { params, headers: new HttpHeaders({ 'Accept': 'application/json' }) })
                      .subscribe({
                        next: (res3: EmployeeDetails[]) => {
                          loader.dismiss();
                          const employeeDtl = res3?.[0];
                          if (employeeDtl && employeeDtl.Key > 0) {
                            this.handleSuccessfulLogin(employeeDtl);
                          } else {
                            this.handleLoginError('Invalid credentials or no employee data returned.');
                          }
                        },
                        error: (err3) => {
                          loader.dismiss();
                          const msg3 = this.buildErrorMessage(err3);
                          this.handleLoginError(msg3 || 'Request failed');
                        }
                      });
                  } else {
                    loader.dismiss();
                    const msg2 = this.buildErrorMessage(err2);
                    this.handleLoginError(msg2 || 'Request failed');
                  }
                }
              });
          } else {
            loader.dismiss();
            const msg = this.buildErrorMessage(err);
            this.handleLoginError(msg || 'Request failed');
          }
        }
      });
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
