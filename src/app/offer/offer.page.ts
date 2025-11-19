import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit {
  htmlStr: string = '';

  constructor(public httpC: HttpClient) { }

  ngOnInit() {
    this.httpC.get("https://1up.co.in/1up_api/api/Pickup/GetOffer").subscribe(res => {
      this.htmlStr = res[0].Text;
      
    });
  }

}
