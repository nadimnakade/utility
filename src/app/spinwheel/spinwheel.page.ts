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
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
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
    await this.loadWheelData();    
    // Assuming you have a service that gets the prizes from the backend
    // await this.spinwheelService.getPrizes().subscribe({
    //   next: (prizes) => {
    //     console.log('Backend prizes:', prizes);

    //     // Map backend data to the format required by ngx-wheel
    //     this.items = prizes.map(prize => ({
    //       id: prize.id,
    //       text: this.formatLabel(prize.description),
    //       fillStyle: prize.fillStyle || '#FF6384',
    //       textFillStyle: prize.textColor || '#ffffff',
    //       textFontSize: prize.textFontSize || '9',
    //       textFontWeight: prize.textFontWeight || 'bold',
    //       chance: prize.chance || 0
    //     }));

    //     console.log('Mapped wheel items:', this.items);
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching prizes:', error);
    //     this.isLoading = false;
    //   }
    // });
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
        text: this.formatLabel(prize.description),
        fillStyle: prize.fillStyle || '#FF6384',
        textFillStyle: prize.textColor || '#ffffff',
        textFontSize: prize.textFontSize || '9',
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

  private formatLabel(text: string): string {
    if (!text) return '';
    const upper = text.toUpperCase().trim();
    if (upper.length <= 10) return upper;
    const mid = Math.floor(upper.length / 2);
    let breakPos = upper.lastIndexOf(' ', mid);
    if (breakPos === -1 || breakPos < 4) breakPos = upper.indexOf(' ', mid);
    if (breakPos === -1) return upper;
    return upper.slice(0, breakPos) + '\n' + upper.slice(breakPos + 1);
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
      duration: 8000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
    this.wheel.reset()
    if (UserKey) {
      this.spinwheelService.insertSprinHistory(UserKey, winner.id, winner.customermobileno).subscribe({
        next: async () => {
          if (amount >= 100) {
            this.showCelebration = true;
            setTimeout(() => this.showCelebration = false, 8000);

            await this.loadWheelData();
          }
          // this.spinsRemaining--;
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
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  getRandomPrize() {
    const eligible = this.items.filter(item => (item.chance || 0) > 0);
    const total = eligible.reduce((acc, item) => acc + (item.chance || 0), 0);
    const r = Math.random() * total;
    let acc = 0;
    for (const item of eligible) {
      acc += item.chance || 0;
      if (r < acc) {
        return item;
      }
    }
    return eligible.length ? eligible[eligible.length - 1] : this.items[0];
  }

  async showNoSpinsMessage() {
    const toast = await this.toastController.create({
      message: 'No spins remaining.!',
      duration: 3000,
      // position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  
}
