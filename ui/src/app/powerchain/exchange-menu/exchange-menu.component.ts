import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MetamaskService } from './metamask.service';


@Component({
  selector: 'app-exchange-menu',
  templateUrl: './exchange-menu.component.html',
  styleUrls: ['./exchange-menu.component.css'],
  providers: [MessageService]
})
export class ExchangeMenuComponent {
  public visible: boolean = false;
  public value3: number = 25;
  public selectedCity: any;
  public filteredGroups: any[] | undefined;
  public groupedCities: any[] | undefined;

  constructor(
    private metamaskService: MetamaskService
  ) {}

  // async connectAndConfigure() {
  //   try {
  //     const accounts = await this.metamaskService.connectToMetamask();
  //     console.log('Connected accounts:', accounts);
  //     await this.metamaskService.configureMumbaiTestnetNetwork();
  //     console.log('Mumbai Testnet network configured in MetaMask');
  //   } catch (error) {
  //     console.error(
  //       'Error connecting to MetaMask or configuring Hedera Testnet network:',
  //       error
  //     );
  //   }
  // }

  // ngOnInit() {
  
  // }

 
 

}
