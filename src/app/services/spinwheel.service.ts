import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SpinWheelPrize {
  id: number;
  amount: number;
  chance: number;
  fillStyle: string;
  textFontWeight: string;
  textColor: string;
  textFontSize: string;
  description: string;
  mobileno: number
}

export interface SpinWheelHistory {
  UserKey: number;
  PrizeId: number;
  CustMobileNo: number;
}


@Injectable({
  providedIn: 'root'
})
export class SpinwheelService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPrizes(): Observable<SpinWheelPrize[]> {
    //const headers = new HttpHeaders().set('userkey', localStorage.getItem('UserKey'));
    //return this.http.get<SpinWheelPrize[]>(`${this.apiUrl}/Pickup/GetSpinConfig`, { headers });
    let userkey = localStorage.getItem('UserKey');
    return this.http.get<SpinWheelPrize[]>(`${this.apiUrl}/Pickup/GetSpinConfig?userkey=${userkey}`);
  }

  insertSprinHistory(userkey: number, prizeid: number, customermobileno: number) {

    return this.http.post(`${this.apiUrl}/Pickup/InsertSpinWheelHistory`, {
      userkey,
      prizeid      
    });
  }

  getRemainingSpins(userId: string): Observable<number> {
    let userkey = localStorage.getItem('UserKey');
    return this.http.get<number>(`${this.apiUrl}/Pickup/GetSpinCount?userkey=${userkey}`);
  }
} 