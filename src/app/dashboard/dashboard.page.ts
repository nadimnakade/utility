import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  userName = localStorage.getItem('EmployeeName');
  balance: number = 1324.26;
  currencies: string[] = ['USD', 'EUR', 'BTC', 'ETH'];
  activeCurrency: string = 'USD';
  rooms = [
    { name: 'Emi', icon: 'calculator', devices: 'EMI Calculator', path: 'emi' },
    { name: 'Company Category', icon: 'business', devices: 'Company List', path: 'companycategory' },
    { name: 'Offer', icon: 'gift', devices: 'Special Offers', path: 'offer' },
    { name: 'Rewards', icon: 'trophy', devices: 'Spin & Win', path: 'spinwheel' }
  ];

  actions = [
    { label: 'Add money', icon: 'add', path: 'emi' },
    { label: 'Exchange', icon: 'swap-horizontal', path: 'offer' },
    { label: 'Details', icon: 'document-text', path: 'companycategory' },
    { label: 'More', icon: 'ellipsis-horizontal', path: 'dashboard' }
  ];

  transactions = [
    { title: 'NVIDIA', sub: 'Yesterday, 1:35 PM', amount: '$ 17.80', ticker: '0.05 NVDA' },
    { title: 'Tesla', sub: 'Sep 27, 6:21 PM', amount: '$ -10 000.00', ticker: '0.12 TSLA' }
  ];
  showPromoBanner = true;

  constructor(private router: Router) {}

  ngOnInit() {
    const dismissed = localStorage.getItem('promoDismissed');
    this.showPromoBanner = dismissed !== 'true';
  }

  navigateTo(room: any) {
    this.router.navigate(['/' + room.path]);
  }

  handleAction(a: any) {
    if (a && a.path) {
      this.router.navigate(['/' + a.path]);
    }
  }

  dismissPromo() {
    this.showPromoBanner = false;
    localStorage.setItem('promoDismissed', 'true');
  }

  ctaPromo() {
    this.router.navigate(['/spinwheel']);
  }
}
