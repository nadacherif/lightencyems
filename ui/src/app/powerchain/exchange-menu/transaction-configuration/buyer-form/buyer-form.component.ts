import { Component, OnInit } from '@angular/core';
import { TradingService } from '../trading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buyer-form',
  templateUrl: './buyer-form.component.html',
  styleUrls: ['./buyer-form.component.css'],
})
export class BuyerFormComponent implements OnInit {
  public form: FormGroup;

  public items: any[] = ['solar', 'wind', 'hydrolic'];
  public selectedItem: string | undefined;

  constructor(
    private fb: FormBuilder,
    private tradingService: TradingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      PB: [null, Validators.required],
      DB: [null, Validators.required],
      EPB: ['solar', Validators.required], // Assuming "solar" is the default value
    });

    this.form.patchValue(
      this.tradingService.getConsolidatedData().buyingConfiguration
    );
  }

  saveForm() {
    if (this.form.valid) {
      this.tradingService.saveBuyingConfiguration(this.form.value);
      // Navigate to the next step or save data as required
      this.router.navigate(['/exchange/seller']);
    } else {
      this.form.markAllAsTouched(); // Triggers validation messages
    }
  }

  // Method to navigate to the previous step
  prevPage() {
    this.router.navigate(['/exchange/personal']);
  }
}
