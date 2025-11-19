import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  userName: string = localStorage.getItem('EmployeeName');
  rooms = [
    { name: 'Emi', icon: 'calculator', devices: 'EMI Calculator', path: 'emi' },
    { name: 'Company Category', icon: 'business', devices: 'Company List', path: 'companycategory' },
    { name: 'Offer', icon: 'gift', devices: 'Special Offers', path: 'offer' },
    { name: 'Rewards', icon: 'trophy', devices: 'Spin & Win', path: 'spinwheel' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateTo(room: any) {
    this.router.navigate(['/' + room.path]);
  }
}
