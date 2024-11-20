import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';


@Component({
  selector: 'app-transaction-configuration',
  templateUrl: './transaction-configuration.component.html',
  styleUrls: ['./transaction-configuration.component.css'],
  providers: [MessageService]
})
export class TransactionConfigurationComponent implements OnInit {


  public selectedItem: string | undefined;
  public items: any[] = ['solar', 'wind', 'hydrolic'];


  public itemsMenu: MenuItem[];






  constructor(
  ) { }

  ngOnInit(): void {
    this.itemsMenu = [
      {
        label: 'Personal information',
        routerLink: '/exchange/personal'
      },
      {
        label: 'Buying configuration',
        routerLink: '/exchange/buyer'
      },
      {
        label: 'Selling configuration',
        routerLink: '/exchange/seller'
      },
      {
        label: 'Confirmation',
        routerLink: '/exchange/confirmation'
      }
    ];
  }

}
