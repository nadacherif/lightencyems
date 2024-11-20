import { Component, OnInit } from '@angular/core';
import { TradingService } from '../trading.service';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { PowerchainService } from 'src/app/powerchain/powerchain.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  public allData;

  public formStatusMessages: Message[] = [];

  public loading: boolean = false;

  public formStatus = {
    personalInformation: 'Invalid',
    buyingConfiguration: 'Invalid',
    sellingConfiguration: 'Invalid',
  };

  constructor(
    private tradingService: TradingService,
    private router: Router,
    private powerchainService: PowerchainService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.allData = this.tradingService.getConsolidatedData();
    this.checkFormValidity();
  }

  submitAllForms() {
    const consolidatedData = this.tradingService.getConsolidatedData();

    // Loading variable
    this.loading = true;

    const formDataUser = {
      key: uuidv4(),
      name: consolidatedData.personalInformation.name,
      email: consolidatedData.personalInformation.email,
      XB: consolidatedData.personalInformation.x,
      YB: consolidatedData.personalInformation.y,
      edge: consolidatedData.personalInformation.edge,
      PB: consolidatedData.buyingConfiguration.PB,
      DB: consolidatedData.buyingConfiguration.DB,
      EPB: consolidatedData.buyingConfiguration.EPB,
      PS: consolidatedData.sellingConfiguration.PS,
      DS: consolidatedData.sellingConfiguration.DS,
      EPS: consolidatedData.sellingConfiguration.EPS,
    };

    this.powerchainService.addUser(formDataUser).subscribe(
      () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User added succefully !',
        });
      },
      () => {
        this.loading = false;
        this.messageService.add({
          severity: 'severity',
          summary: 'Error',
          detail: 'oops ! something went wrong . ',
        });
      }
    );
  }

  // Method to navigate to the previous step
  prevPage() {
    this.router.navigate(['/exchange/seller']);
  }

  checkFormValidity() {
    const formValues = this.tradingService.getConsolidatedData();

    // For Personal Information
    this.formStatusMessages.push(
      formValues.personalInformation.name &&
        formValues.personalInformation.email &&
        formValues.personalInformation.x &&
        formValues.personalInformation.y &&
        formValues.personalInformation.edge
        ? {
            severity: 'success',
            summary: 'Personal Information',
            detail: 'Valid',
          }
        : {
            severity: 'error',
            summary: 'Personal Information',
            detail: 'Missing or invalid fields',
          }
    );

    // For Buying Configuration
    this.formStatusMessages.push(
      formValues.buyingConfiguration.PB &&
        formValues.buyingConfiguration.DB &&
        formValues.buyingConfiguration.EPB
        ? {
            severity: 'success',
            summary: 'Buying Configuration',
            detail: 'Valid',
          }
        : {
            severity: 'error',
            summary: 'Buying Configuration',
            detail: 'Missing or invalid fields',
          }
    );

    // For Selling Configuration
    this.formStatusMessages.push(
      formValues.sellingConfiguration.PS &&
        formValues.sellingConfiguration.DS &&
        formValues.sellingConfiguration.EPS
        ? {
            severity: 'success',
            summary: 'Selling Configuration',
            detail: 'Valid',
          }
        : {
            severity: 'error',
            summary: 'Selling Configuration',
            detail: 'Missing or invalid fields',
          }
    );
  }

  // Loading function
  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
