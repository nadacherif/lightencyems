import { Component, OnInit } from '@angular/core';
import { PowerchainService } from '../../powerchain.service';
import { SortEvent } from 'primeng/api';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { AutoCompleteModule } from 'primeng/autocomplete';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface Functionality {
  name: string;
  code: string;
}
@Component({
  selector: 'app-history-exchange',
  templateUrl: './history-exchange.component.html',
  styleUrls: ['./history-exchange.component.css'],
})
export class HistoryExchangeComponent implements OnInit {
  public loading: boolean = false;  // Add this property here
  public transactions: any = [];
  public searchQuery: string = '';
  public transactedEnergyData: ChartDataSets[] = [];
  public transactionPriceData: ChartDataSets[] = [];
  public transactedEnergyLineData = null;
  public transactionPriceLineData = null;
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{ id: 'x-axis-0', position: 'bottom' }],
      yAxes: [
        { id: 'y-axis-0', position: 'left', ticks: { beginAtZero: true } },
      ],
    },
  };
  public chartColors: Color[] = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];

  selectedFunctionality: Functionality | undefined;

  functionalities: Functionality[] | undefined;

  satellites: any[] | undefined;

  filteredSatellites: any[] | undefined;

  constructor(private powerchainService: PowerchainService) {}

  ngOnInit() {
    this.functionalities = [
      { name: 'Buyer', code: 'BUYER' },
      { name: 'Seller', code: 'SELLER' },
    ];
    this.fetchTransactions();
    this.prepareChartData();
    this.powerchainService.getTransactions().subscribe((data) => {
      const uniqueBuyers = new Set<string>();
      const uniqueSellers = new Set<string>();

      data.forEach((transaction) => {
        uniqueBuyers.add(transaction.buyer);
        uniqueSellers.add(transaction.seller);
      });

      this.satellites = Array.from(
        new Set([...uniqueBuyers, ...uniqueSellers])
      );
    });
  }

  searchTransactionsAutocomplete(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.satellites as any[]).length; i++) {
      let satellite = (this.satellites as any[])[i];
      if (satellite.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(satellite);
      }
    }

    this.filteredSatellites = filtered;
  }

  fetchTransactions() {
    this.powerchainService.getTransactions().subscribe((data) => {
      this.transactions = data;
      this.prepareChartData();
    });
  }

  onFunctionalityChange() {
    // When the dropdown selection changes, perform the search
    this.searchTransactions();
  }

  searchTransactions() {
    if (this.searchQuery.trim() !== '') {
      this.powerchainService
        .getUserDataAndCharts(this.searchQuery)
        .subscribe((data) => {
          // Filter transactions based on selected functionality (buyer or seller)
          this.transactions = data.filter((transaction) => {
            if (this.selectedFunctionality) {
              if (this.selectedFunctionality.code === 'BUYER') {
                return transaction.buyer
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase());
              } else if (this.selectedFunctionality.code === 'SELLER') {
                return transaction.seller
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase());
              }
            }
            // If no functionality is selected, return all transactions
            return true;
          });
          this.prepareChartData();
        });
    } else {
      // If the search query is empty, fetch all transactions
      this.fetchTransactions();
    }
  }

  prepareChartData() {
    this.transactedEnergyLineData = {
      labels: this.transactions.map((transaction) => transaction.Timestamp),
      datasets: [
        {
          data: this.transactions.map((transaction) =>
            this.searchQuery.trim() === '' ||
            this.searchQuery.trim() === transaction['seller']
              ? transaction['Energy Transacted']
              : 0
          ),
          label: 'Sold Energy',
          borderColor: 'rgba(255, 99, 132, 1)', // You can set a specific color for the sold energy line
          fill: true, // Don't fill the area under the line
        },
        {
          data: this.transactions.map((transaction) =>
            this.searchQuery.trim() === '' ||
            this.searchQuery.trim() === transaction['buyer']
              ? transaction['Energy Transacted']
              : 0
          ),
          label: 'Bought Energy',
          borderColor: 'rgba(75, 192, 192, 1)', // You can set a specific color for the bought energy line
          fill: true, // Don't fill the area under the line
        },
      ],
    };

    this.transactionPriceLineData = {
      labels: this.transactions.map((transaction) => transaction.Timestamp),
      datasets: [
        {
          data: this.transactions.map((transaction) =>
            this.searchQuery.trim() === '' ||
            this.searchQuery.trim() === transaction['seller']
              ? transaction['Transaction Price']
              : 0
          ),
          label: 'Sold Price',
          borderColor: 'rgba(255, 99, 132, 1)', // You can set a specific color for the sold energy line
          fill: true, // Don't fill the area under the line
        },
        {
          data: this.transactions.map((transaction) =>
            this.searchQuery.trim() === '' ||
            this.searchQuery.trim() === transaction['buyer']
              ? transaction['Transaction Price']
              : 0
          ),
          label: 'Bought Price',
          borderColor: 'rgba(75, 192, 192, 1)', // You can set a specific color for the bought energy line
          fill: true, // Don't fill the area under the line
        },
      ],
    };
  }

  openTransactionDetails(transaction: any) {
    const url = `https://mumbai.polygonscan.com/tx/${transaction['Transaction Receipt']}`;
    window.open(url, '_blank');
  }

  customSortBuyers(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return event.order * result;
    });
  }
}
