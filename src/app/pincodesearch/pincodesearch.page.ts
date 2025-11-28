import { Component, ViewChild, OnInit } from '@angular/core';
declare var $;

@Component({
  selector: 'app-pincodesearch',
  templateUrl: './pincodesearch.page.html',
  styleUrls: ['./pincodesearch.page.scss'],
})
export class PincodesearchPage implements OnInit {
  @ViewChild('dataTable') table;
  dataTable: any;

  ngOnInit(): void {
    const datatable = $('#dataTable').DataTable({
      processing: true,
      serverSide: true,
      info: true,
      stateSave: false,
      bDestroy: true,
      lengthMenu: [[10, 50, 100, -1], [10, 50, 100, 'All']],
      sAjaxSource: 'https://1up.co.in/1up_api/PinCodeSearch.ashx',
      fnServerParams: function (aoData) {
        const searchValue = $('#dataTable_filter input').val() ? $('#dataTable_filter input').val().toString().trim() : '';
        aoData.push({ name: 'PinCode', value: searchValue });
      },
      columnDefs: [
        {
          targets: 0,
          orderable: false
        }
      ],
      columns: [
        { data: 'BankName', name: 'BankName', autoWidth: true },
        { data: 'PinCode', name: 'PinCode', autoWidth: true },
        { data: 'Address', name: 'Address', autoWidth: true },
        { data: 'Serviceable', name: 'Serviceable', autoWidth: true },
        { data: 'RMName', name: 'RMName', autoWidth: true },
        { data: 'RMEmail', name: 'RMEmail', autoWidth: true },
        { data: 'RMContact', name: 'RMContact', autoWidth: true }
        
      ]
    });

    const searchInput = $('#dataTable_filter input');
    searchInput.off('.DT');
    let searchTimer: any;
    searchInput.on('input', function () {
      clearTimeout(searchTimer);
      const val = $(this).val().toString().trim();
      searchTimer = setTimeout(() => {
        if (val.length === 0) {
          datatable.search('').draw();
        } else if (val.length >= 3) {
          datatable.search(val).draw();
        } else {
          if (datatable.search() !== '') {
            datatable.search('').draw();
          }
        }
      }, 400);
    });
  }
}