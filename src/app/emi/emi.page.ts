
import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

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
    private socialSharing: SocialSharing,
    private androidPermissions: AndroidPermissions
  ) { }

  ngOnInit() {
  }

  async whatsappShare() {
    const loanAmount = Number(this.LoanAmt);
    const numberOfMonths = Number(this.Months);
    const rateOfInterest = Number(this.ROI);
    if (!loanAmount || !numberOfMonths || !rateOfInterest) {
      const message = 'Please enter LoanAmt, Months and ROI, then calculate.';
      this.socialSharing.share(message);
      return;
    }

    const monthlyInterestRatio = (rateOfInterest / 100) / 12;
    const top = Math.pow((1 + monthlyInterestRatio), numberOfMonths);
    const bottom = top - 1;
    const sp = top / bottom;
    const emi = ((loanAmount * monthlyInterestRatio) * sp);

    const msg = [
      'EMI Details',
      `Loan: ₹${this.formatInr(loanAmount)}`,
      `Months: ${numberOfMonths}`,
      `ROI: ${rateOfInterest}%`,
      `EMI: ₹${this.formatInr(emi)}`
    ].join('\n');

    const params = new HttpParams()
      .set('LoanAmt', String(this.LoanAmt))
      .set('Months', String(this.Months))
      .set('ROI', String(this.ROI));

    this.httpC.get('https://1up.co.in/1up_api/api/UpdateStatus/EMI', { params, responseType: 'text' }).subscribe({
      next: async (fileName: string) => {
        const fileUrl = `https://1up.co.in/1up_api/Uploads/${fileName}`;
        const target = `file:///storage/emulated/0/Download/${fileName}`;

        // Share text with remote link (avoid native HTTP).
        try {
          await this.socialSharing.share(`${msg}\n${fileUrl}`);
        } catch {
          await this.socialSharing.share(msg);
        }
      },
      error: () => {
        this.socialSharing.share(msg);
      }
    });
  }

  private formatInr(value: number): string {
    return new Intl.NumberFormat('en-IN').format(Math.round(value));
  }

  private deleteFile(path: string) {
    try {
      (window as any).resolveLocalFileSystemURL(path, (entry: any) => {
        try { entry.remove(() => {}, () => {}); } catch {}
      }, () => {});
    } catch {}
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
