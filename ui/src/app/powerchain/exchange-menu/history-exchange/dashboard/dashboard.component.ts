import { Component } from '@angular/core';
import { PowerchainService } from 'src/app/powerchain/powerchain.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  numberOfBuyers: number;
  numberOfSellers: number;
  totalEnergyTransacted: number = 0;
  averagePricePerKwh: number = 0;

  constructor(private powerchainService: PowerchainService) {}

  ngOnInit() {
    this.powerchainService.getBuyers().subscribe((buyers) => {
      this.numberOfBuyers = buyers.length;
    });

    this.powerchainService.getSellers().subscribe((sellers) => {
      this.numberOfSellers = sellers.length;
    });

    this.powerchainService.getTransactions().subscribe((transactions) => {
      // Calculate the total energy transacted in watts
      const totalEnergyInWatts = transactions.reduce(
        (totalEnergy, transaction) => {
          return totalEnergy + transaction['Energy Transacted'];
        },
        0
      );

      const totalPrices = transactions.reduce((total, transaction) => {
        return total + transaction['Transaction Price'];
      }, 0);

      // Convert total energy from watts to kilowatts
      this.totalEnergyTransacted = totalEnergyInWatts / 1000;
      this.averagePricePerKwh = totalPrices / transactions.length;
    });
  }
}
