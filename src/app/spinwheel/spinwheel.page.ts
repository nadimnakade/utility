import { Component, ViewChild, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';
import { SpinwheelService, SpinWheelPrize } from '../services/spinwheel.service';
import * as confetti from 'canvas-confetti';


@Component({
  selector: 'app-spinwheel',
  templateUrl: './spinwheel.page.html',
  styleUrls: ['./spinwheel.page.scss']
})
export class SpinwheelPage implements OnInit {
  @ViewChild(NgxWheelComponent, { static: false }) wheel;

  items: any[] = [];
  showCelebration = false;
  textOrientation: TextOrientation = TextOrientation.VERTICAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;
  idToLandOn: number = 0;
  winningAmount: string = '';
  spinsRemaining: number = 1;
  isLoading: boolean = true;


  constructor(

    private cdr: ChangeDetectorRef,
    private toastController: ToastController,
    private spinwheelService: SpinwheelService
  ) { }

  async ngOnInit() {
    //await this.loadWheelData();    
    // Assuming you have a service that gets the prizes from the backend
    await this.spinwheelService.getPrizes().subscribe({
      next: (prizes) => {
        console.log('Backend prizes:', prizes);

        // Map backend data to the format required by ngx-wheel
        this.items = prizes.map(prize => ({
          id: prize.id,
          text: prize.description,
          fillStyle: prize.fillStyle || '#FF6384',
          textFillStyle: prize.textColor || '#ffffff',
          textFontSize: prize.textFontSize || '13',
          textFontWeight: prize.textFontWeight || 'bold',
          chance: prize.chance || 0
        }));

        console.log('Mapped wheel items:', this.items);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching prizes:', error);
        this.isLoading = false;
      }
    });
    // this.items = [
    //   { id: 1, text: 'Chocolate', fillStyle: '#FF6384', textColor: 'white', textFontSize: '16', textFontWeight: 'bold', chance: 26.4 },
    //   { id: 2, text: '₹200', fillStyle: '#36A2EB', textColor: 'white', textFontSize: '16', textFontWeight: 'bold', chance: 40.0 },
    //   { id: 3, text: '₹500', fillStyle: '#FFCE56', textColor: 'white', textFontSize: '16', textFontWeight: 'bold', chance: 30.0 },
    //   { id: 4, text: '₹1000', fillStyle: '#4BC0C0', textColor: 'white', textFontSize: '16', textFontWeight: 'bold', chance: 3.0 },
    //   { id: 5, text: '₹2000', fillStyle: '#9966FF', textColor: 'white', textFontSize: '16', textFontWeight: 'bold', chance: 0.5 },
    //   { id: 6, text: '₹5000', fillStyle: '#FF9F40', textColor: 'white', textFontSize: '16', textFontWeight: 'bold', chance: 0.1 }
    // ];


  }

  private async loadWheelData() {
    this.isLoading = true;

    const userId = localStorage.getItem('UserKey');
    if (userId) {
      this.spinwheelService.getRemainingSpins(userId).subscribe({
        next: (spins) => {
          this.spinsRemaining = spins;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching remaining spins:', error);
          this.showError('Error loading spin count');
          this.isLoading = false;
        }
      });
    }
    // Get prizes and probabilities from the backend
    await this.spinwheelService.getPrizes().subscribe(prizes => {
      this.items = prizes.map((prize: any) => ({
        id: prize.id,
        text: prize.description,
        fillStyle: prize.fillStyle || '#FF6384',
        textFillStyle: prize.textColor || '#ffffff',
        textFontSize: prize.textFontSize || '13',
        textFontWeight: prize.textFontWeight || 'bold',
        chance: prize.chance || 0,
      }));
    })
    //  await this.spinwheelService.getPrizes().subscribe({
    //     next: (prizes) => {
    //       console.log('Backend prizes:', prizes);  // Log the raw backend data

    //       // Ensure data is mapped to the correct format
    //       this.items = prizes.map(prize => ({
    //         id: prize.id,  // Directly map the 'id' field
    //         text: prize.description,  // Directly map the 'text' field
    //         fillStyle: prize.fillStyle || '#FF6384',  // Use fillStyle if provided, fallback to default color
    //         textColor: prize.textColor || 'white',  // Default text color
    //         textFontSize: prize.textFontSize || '16',  // Default font size
    //         textFontWeight: prize.textFontWeight || 'bold',  // Default font weight
    //         chance: prize.chance || 0,  // Use the 'chance' field from backend, fallback to 0
    //         description: prize.description || 'No Description'  // Fallback if description is missing
    //       }));

    //       this.cdr.detectChanges();

    //       // Proceed with the rest of the code, like fetching remaining spins for the user
    //       const userId = localStorage.getItem('UserKey');
    //       if (userId) {
    //         this.spinwheelService.getRemainingSpins(userId).subscribe({
    //           next: (spins) => {
    //             this.spinsRemaining = spins;
    //             this.isLoading = false;
    //           },
    //           error: (error) => {
    //             console.error('Error fetching remaining spins:', error);
    //             this.showError('Error loading spin count');
    //             this.isLoading = false;
    //           }
    //         });
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Error fetching prizes:', error);
    //       this.showError('Error loading wheel data');
    //       this.isLoading = false;
    //     }
    //   });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);  // Check what has changed
  }

  async spin() {
    if (this.spinsRemaining <= 0) {
      this.showNoSpinsMessage();
      return;
    }

    const prize = this.getRandomPrize();
    this.idToLandOn = prize.id;
    await new Promise(resolve => setTimeout(resolve, 0));
    this.wheel.spin();
  }

  async before() { }

  async after() {
    const winner = this.items.find(item => item.id === this.idToLandOn);
    const amount = parseInt(winner.text.replace('₹', ''));
    this.winningAmount = winner.text.replace('₹', '');

    // Record the spin
    const UserKey = Number(localStorage.getItem('UserKey'));
    this.showCelebration = true;
    setTimeout(() => this.showCelebration = false, 4000);
    const toast = await this.toastController.create({
      message: `Congratulations! You won ₹${this.winningAmount}!`,
      duration: 3000,
      position: 'middle',
      color: 'success'
    });
    toast.present();
    this.wheel.reset()
    if (UserKey) {
      this.spinwheelService.insertSprinHistory(UserKey, winner.id, winner.customermobileno).subscribe({
        next: () => {
          if (amount >= 100) {
            this.showCelebration = true;
            setTimeout(() => this.showCelebration = false, 4000);
          }
          this.spinsRemaining--;
        },
        error: (error) => {
          console.error('Error recording spin:', error);
          this.showError('Error recording spin result');
        }
      });
    }
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'middle',
      color: 'danger'
    });
    toast.present();
  }

  getRandomPrize() {
    const random = Math.random() * 100;
    let sum = 0;

    for (const item of this.items) {
      sum += item.chance;
      if (random <= sum) {
        return item;
      }
    }
    return this.items[0];
  }

  async showNoSpinsMessage() {
    const toast = await this.toastController.create({
      message: 'No spins remaining.!',
      duration: 3000,
      position: 'middle',
      color: 'warning'
    });
    toast.present();
  }

  
}
