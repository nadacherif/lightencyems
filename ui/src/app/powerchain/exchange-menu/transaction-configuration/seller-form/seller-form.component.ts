import { Component, OnInit } from '@angular/core';
import { TradingService } from '../trading.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-seller-form',
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
})
export class SellerFormComponent implements OnInit {
  public form: FormGroup;

  public items: any[] = ['solar', 'wind', 'hydrolic'];
  public selectedItem: string | undefined;

  constructor(
    private tradingService: TradingService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      PS: [null, Validators.required],
      DS: [null, Validators.required],
      EPS: ['solar', Validators.required], // Assuming "solar" is the default value
    });

    this.form.patchValue(
      this.tradingService.getConsolidatedData().sellingConfiguration
    );
  }

  saveAndNavigate() {
    if (this.form.valid) {
      this.tradingService.saveSellingConfiguration(this.form.value);
      // Navigate to the next step
      this.router.navigate(['/exchange/confirmation']);
    }
  }

  // Method to navigate to the previous step
  prevPage() {
    this.router.navigate(['/exchange/buyer']);
  }
}
