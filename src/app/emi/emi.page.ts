
import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-emi',
  templateUrl: './emi.page.html',
  styleUrls: ['./emi.page.scss'],
})
export class EmiPage implements OnInit {
  @ViewChildren('tblEMI') ces: QueryList<ElementRef>;
  private fieldArray: Array<any> = [];
  htmlStr: string = '';
  LoanAmt: any;
  Months: any;
  ROI: any;
  public lstEMI = new Array<EMI>();

  constructor(
    public httpC: HttpClient,
    private elRef: ElementRef,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
  }

  whatsappShare() {


    const params = new HttpParams().set('LoanAmt', this.LoanAmt)
      .set('Months', this.Months)
      .set('ROI', this.ROI);

    const httpOptions = {
      headers: new HttpHeaders(
        { 'Content-Type': 'application/json' },
      )
    };

    this.httpC.get("https://1up.co.in/1up_api/api/UpdateStatus/EMI", { params: params }).subscribe(res => {
      var filepath = "https://1up.co.in/1up_api/Uploads/" + res;
      this.socialSharing.share("EMI", null, filepath).then(res => {
        console.log("success : " + res);
      }).catch(error => {
        console.log("failed : " + error);
      })
    });


  }

  // getSelectOptionValue():any {
  //   let area_list_url = '/select_option_list/';

  //   return this.httpC.get("http://103.137.92.198:8080/1up_api/api/UpdateStatus/EMI").map( /// <<<=== use `map` here
  //     (response) => {
  //       let data = response.text() ? response.json() : [{}];
  //       if (data) {
  //         Constant.areaList = data;
  //       }
  //       return JSON.stringify(Constant.areaList);
  //     }
  //   );
  // }


  CalcluateEMI() {
    this.lstEMI = new Array<EMI>();
    var detailDesc = "";
    var bb = parseInt(this.LoanAmt);
    var numberOfMonths = this.Months;
    var rateOfInterest = this.ROI;

    var loanAmount = this.LoanAmt;
    var numberOfMonths = this.Months;
    var rateOfInterest = this.ROI;
    var monthlyInterestRatio = (rateOfInterest / 100) / 12;

    var top = Math.pow((1 + monthlyInterestRatio), numberOfMonths);
    var bottom = top - 1;
    var sp = top / bottom;
    var emi = ((loanAmount * monthlyInterestRatio) * sp);
    var full = numberOfMonths * emi;
    var interest = full - loanAmount;
    var int_pge = (interest / full) * 100;

    //$("#tbl_loan_pge").html((100-int_pge.toFixed(2))+" %");

    var emi_str = emi.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var loanAmount_str = loanAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var full_str = full.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var int_str = interest.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");



    var int_dd = 0; var pre_dd = 0; var end_dd = 0;
    for (var j = 1; j <= numberOfMonths; j++) {
      int_dd = bb * ((rateOfInterest / 100) / 12);
      pre_dd = emi - int_dd;
      end_dd = bb - pre_dd;

      var obj = new EMI();
      obj.SrNo = j;
      obj.LoanAmt = bb.toFixed(2);
      obj.EMI = emi.toFixed(2);
      obj.Principal = pre_dd.toFixed(2);
      obj.ROI = int_dd.toFixed(2);
      obj.Balance = end_dd.toFixed(2);;

      this.lstEMI.push(obj);
      bb = bb - pre_dd;






    }    
  }

}

export class EMI {
  SrNo: Number;
  ROI: string;
  LoanAmt: any;
  Principal: any;
  Interest: any;
  Balance: any;
  EMI: any;




}
