import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var $;

@Component({
  selector: 'app-banksearch',
  templateUrl: './banksearch.page.html',
  styleUrls: ['./banksearch.page.scss']
})
export class BanksearchPage implements OnInit {
  @ViewChild('dataTable') table;
  dataTable: any;
  dtOptions: any;
  pinCode: string = '';
  private pinTimer: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.dataTable = $("#dataTable").DataTable({
      processing: true,
      serverSide: true,
      info: true,
      stateSave: false,
      bDestroy: true,
      lengthMenu: [[10, 50, 100, -1], [10, 50, 100, 'All']],
      ajax: (data, callback) => {
        const pin = (this.pinCode || '').trim();
        if (pin.length < 4) {
          callback({ data: [], recordsTotal: 0, recordsFiltered: 0, draw: data.draw });
          return;
        }
        const params = {
          iDisplayLength: data.length,
          iDisplayStart: data.start,
          iSortCol_0: (data.order && data.order[0] ? data.order[0].column : 0),
          sSortDir_0: (data.order && data.order[0] ? data.order[0].dir : 'asc'),
          sSearch: '',
          PinCode: pin
        };
        $.ajax({
          url: 'https://1up.co.in/1up_api/PinCodeSearch.ashx',
          data: params,
          dataType: 'json'
        }).done((res) => {
          callback({
            data: res.aaData || [],
            recordsTotal: res.iTotalRecords || 0,
            recordsFiltered: res.iTotalDisplayRecords || 0,
            draw: data.draw
          });
        }).fail(() => {
          callback({ data: [], recordsTotal: 0, recordsFiltered: 0, draw: data.draw });
        });
      },
      columnDefs: [{
        targets: 0,
        orderable: false
      }],
      columns: [
        { data: 'BankName', name: 'BankName', autoWidth: true },
        { data: 'PinCode', name: 'PinCode', autoWidth: true },
        { data: 'Address', name: 'Address', autoWidth: true },
        { data: 'RMName', name: 'RMName', autoWidth: true },
        { data: 'RMEmail', name: 'RMEmail', autoWidth: true },
        { data: 'RMContact', name: 'RMContact', autoWidth: true }
      ]
    });
  }

  applyPin() {
    const pin = (this.pinCode || '').trim();
    if (this.pinTimer) clearTimeout(this.pinTimer);
    this.pinTimer = setTimeout(() => {
      if (pin.length >= 4) {
        this.dataTable.ajax.reload();
      } else {
        this.dataTable.clear().draw();
      }
    }, 400);
  }

  onPinChange(value: string) {
    this.pinCode = value;
    this.applyPin();
  }
}
