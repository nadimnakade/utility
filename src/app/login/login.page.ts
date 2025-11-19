import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
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
  // Add other properties expected in the response here for completeness
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // 1. Defined API URL as a constant
  private readonly apiUrl = 'https://1up.co.in/1up_api/api/UpdateStatus/ValidateLogin';

  // 2. Used better typing for component properties
  mobileno: string = '';
  versionInfo: string = '';
  UserName: string = '';
  Password: string = '';
  deviceid: string | number = '';
  EmployeeDtl: EmployeeDetails | null = null;

  // The registerCredentials property seems unused for login, consider removing it
  // registerCredentials = { email: '', password: '', mobileno: '' }; 

  constructor(
    private nav: NavController,
    private splashScreen: SplashScreen,
    private httpC: HttpClient,
    private device: Device,
    private appversionInfo: AppVersion,
    private alertController: AlertController, // Added for better error handling
    private loadingController: LoadingController // Added for better UX
  ) {
    this.appversionInfo.getVersionNumber().then(version => {
      this.versionInfo = version;
    });
  }

  ngOnInit() {
    // Initialization logic here (if needed)
  }

  /**
   * Performs the user login operation.
   * IMPROVEMENT: Uses POST for security and proper RxJS error handling.
   */
  async login(): Promise<void> {
    const loader = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'crescent',
    });
    await loader.present();

    // 3. Determine Device ID and ensure fallback
    this.deviceid = this.device.uuid 
      ? this.device.uuid 
      : Math.floor(1000000 + Math.random() * 8000000);

    // 4. Prepare the Request Payload (Body)
    const payload: LoginPayload = {
      UserName: this.UserName,
      Password: this.Password,
      UUID: this.deviceid,
      Type: localStorage.getItem('PushToken')
    };

    // 5. Define Request Headers (Content-Type is often automatically handled by POST)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // 6. Execute the HTTP POST Request with proper error handling
    this.httpC.post<EmployeeDetails[]>(this.apiUrl, payload, { headers })
      .subscribe({
        next: (res: EmployeeDetails[]) => {
          loader.dismiss();
          const employeeDtl = res?.[0]; // Safely get the first element

          if (employeeDtl && employeeDtl.Key > 0) {
            this.handleSuccessfulLogin(employeeDtl);
          } else {
            this.handleLoginError('Invalid credentials or no employee data returned.');
          }
        },
        error: (err) => {
          loader.dismiss();
          console.error('Login HTTP Error:', err);
          this.handleLoginError('A network or server error occurred. Please try again.');
        }
      });
  }

  /**
   * Helper function to store user data and navigate on success.
   */
  private handleSuccessfulLogin(employeeDtl: EmployeeDetails): void {
    // Store critical data, ensuring values are strings
    localStorage.setItem('IsLoggedIn', 'true');
    localStorage.setItem('UDID', String(this.deviceid));
    // Use data from the response for reliability
    localStorage.setItem('MobileNo', employeeDtl.OfficeContactNo);
    localStorage.setItem('UserSession', JSON.stringify(employeeDtl));
    localStorage.setItem('UserKey', String(employeeDtl.Key));
    localStorage.setItem('EmployeeName', employeeDtl.EmployeeName);
    
    // Better alternative to location.reload() is routing, but keeping original flow:
    this.splashScreen.show();
    // Consider replacing location.reload() with this.nav.navigateRoot(['/home']);
    location.reload(); 
  }

  /**
   * Helper function to display Ionic Alert on failure.
   */
  private async handleLoginError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}