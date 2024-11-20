import { Injectable } from '@angular/core';

@Injectable()
export class TradingService {
  private formData = {
    personalInformation: {
      name: '',
      email: '',
      x: null,
      y: null,
      edge: null,
    },
    buyingConfiguration: {
      EB: null,
      PB: null,
      DB: null,
      EPB: 'solar',
    },
    sellingConfiguration: {
      ES: null,
      PS: null,
      DS: null,
      EPS: 'solar',
    },
  };

  savePersonalInformation(data: any) {
    this.formData.personalInformation = data;
  }

  saveBuyingConfiguration(data: any) {
    this.formData.buyingConfiguration = data;
  }

  saveSellingConfiguration(data: any) {
    this.formData.sellingConfiguration = data;
  }

  getConsolidatedData() {
    return this.formData;
  }
}
