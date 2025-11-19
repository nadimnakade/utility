import { Component, ViewChild, OnInit } from '@angular/core';


import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
declare var $;
export interface Data {
  movies: string;
}

@Component({
  selector: 'app-companycategory',
  templateUrl: './companycategory.page.html',
  styleUrls: ['./companycategory.page.scss'],
})
export class CompanycategoryPage implements OnInit {

  @ViewChild('dataTable') table;
  dataTable: any;
  dtOptions: any;
  constructor() {
  }

  ngOnInit(): void {
    const datatable = $("#dataTable").DataTable({
      "processing": true,
      "serverSide": true,
      "info": true,
      "stateSave": true,
      "bDestroy": true,
      "lengthMenu": [[10, 50, 100, -1], [10, 50, 100, "All"]],
      sAjaxSource: "https://1up.co.in/1up_api/CompanyCategory.ashx",
      // Removed 'searchDelay' here as we will handle debouncing manually         
      //for passing parameter to handler
      "fnServerParams": function (aoData) {
        aoData.push({ "name": "ProductKey", "value": 0 }, { "name": "BankKey", "value": 0 });
      },
      "columnDefs": [{
        "targets": 0,
        "orderable": false
      }],
      "columns": [

        { "data": "NAME", "name": "Name", "autoWidth": true },
        { "data": "CATEGORY", "name": "Category", "autoWidth": true },
        { "data": "BANK", "name": "Bank", "autoWidth": true },
        { "data": "PRODUCT", "name": "Product", "autoWidth": true }

      ]
    });

    // --- NEW FIX: Custom Handler for Min Length and Debouncing ---
    const searchInput = $('#dataTable_filter input');

    // 1. Remove default DataTables handlers from the search input
    searchInput.off('.DT');

    // 2. Bind custom handler with manual debouncing
    let searchTimer: any;
    searchInput.on('input', function () {
      // Clear previous timer to ensure we wait 400ms after the last key stroke
      clearTimeout(searchTimer);
      const searchValue = $(this).val().toString().trim();

      searchTimer = setTimeout(() => {
        // Condition 1: If search is cleared, show all data immediately
        if (searchValue.length === 0) {
          datatable.search(searchValue).draw();
        }
        // Condition 2: If length is 4 or more, execute the search
        else if (searchValue.length >= 4) {
          datatable.search(searchValue).draw();
        }
        // Condition 3: If length is 1-3, ensure the search filter is cleared 
        // (in case a longer search was just deleted)
        else {
          // Only redraw if the current filter is not already empty
          if (datatable.search() !== '') {
            datatable.search('').draw(); // Clear filter to show full list
          }
        }
      }, 400); // 400ms debounce delay
    });
  }


}
