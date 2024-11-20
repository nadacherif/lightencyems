import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TradingService } from '../trading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-form',
  templateUrl: './personal-form.component.html',
  styleUrls: ['./personal-form.component.css'],
})
export class PersonalFormComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public tradingService: TradingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      x: ['', [Validators.required, Validators.min(1), Validators.max(150)]],
      y: ['', [Validators.required, Validators.min(1), Validators.max(150)]],
      edge: ['', [Validators.required, Validators.min(-1)]],
    });

    this.form.patchValue(
      this.tradingService.getConsolidatedData().personalInformation
    );
  }

  saveForm() {
    if (this.form.valid) {
      this.tradingService.savePersonalInformation(this.form.value);
      this.router.navigate(['/exchange/buyer']);
    } else {
      this.form.markAllAsTouched(); // Marks all controls as touched to trigger validation messages
    }
  }
}
