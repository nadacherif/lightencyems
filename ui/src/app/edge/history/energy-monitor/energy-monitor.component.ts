import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

interface Edge {
  name: string;
  code: number;
}

interface TimeFrame {
  label: string;
  value: string;
}

@Component({
  selector: 'app-energy-monitor',
  templateUrl: './energy-monitor.component.html',
})
export class EnergyMonitorComponent implements OnInit {
  private client: InfluxDB;
  private token =
    'GHRHUdhE-Nh0vHxYyyHlnF7l5ODc9oPONKnr_q7wlep743jW6tAKo_GXe0284mpY-LVJejfwZygIS2Lu4XEtRw==';
  private url = 'http://localhost:8086';
  private org = 'lightency'; // You'll also need to specify the organization
  private labelMapping: { [key: string]: string } = {
    '_sum/ConsumptionActivePower': 'Consumption',
    '_sum/EssSoc': 'Battery',
    '_sum/GridActivePower': 'Grid',
    '_sum/ProductionAcActivePower': 'Production',
  };
  datasets: any[] = [];
  labels: string[] = [];
  options: any = {}; // or provide actual chart options if you have them
  colors: any[] = []; // or provide actual colors if you have them
  chartType: string = 'line'; // or any other default type you prefer
  loading: boolean = true;
  selectedEdge: Edge = { name: 'Central', code: 0 }; // Initialize to 0 by default
  edges: Edge[] | undefined; // Numeric edge values
  selectedTimeFrame: TimeFrame = { label: '1H', value: '-1h' };
  timeFrames: TimeFrame[] | undefined;
  colorIndex = 0;
  chartColors: string[] = ['red', 'blue', 'green', 'purple'];

  ngOnInit(): void {
    this.client = new InfluxDB({ url: this.url, token: this.token });
    this.fetchData();
    this.edges = [
      { name: 'Central', code: 0 },
      { name: 'Satellite 1', code: 1 },
      { name: 'Satellite 2', code: 2 },
      { name: 'Satellite 3', code: 3 },
    ];
    this.timeFrames = [
      { label: '5 min', value: '-5m' },
      { label: '15 min', value: '-15m' },
      { label: '30 min', value: '-30m' },
      { label: '24H', value: '-24h' },
      { label: '30D', value: '-30d' },
    ];
  }

  fetchData() {
    const fluxQuery = `
    from(bucket: "nada")
  |> range(start: ${this.selectedTimeFrame.value})
  |> filter(fn: (r) => r["_measurement"] == "timedata1")
  |> filter(fn: (r) => r["_field"] == "_sum_ConsumptionActivePower" or r["_field"] == "_sum_EssActivePower" or r["_field"] == "_sum_EssSoc" or r["_field"] == "_sum_GridActivePower" or r["_field"] == "_sum_ProductionActivePower")
  |> yield(name: "mean")
    `;

    const queryClient = this.client.getQueryApi(this.org);

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);

        // Assuming 'time' is one of the fields in your data
        if (!this.labels.includes(tableObject._time)) {
          this.labels.push(tableObject._time);
        }
        const originalLabel = tableObject._field;
        const mappedLabel = this.getMappedLabel(originalLabel);

        const existingDataset = this.datasets.find(
          (ds) => ds.originalLabel === originalLabel
        );
        if (existingDataset) {
          existingDataset.data.push(tableObject._value);
        } else {
          const newColor = this.getRandomColor();
          this.datasets.push({
            originalLabel: originalLabel, // Store the original label for differentiation
            label: mappedLabel, // Use the mapped label for display
            data: [tableObject._value],
            borderColor: newColor,
            backgroundColor: this.getBackgroundColorFromBorderColor(newColor),
            pointRadius: 0,
          });
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
      complete: () => {
        this.loading = false;
        console.log('Data fetch completed');
      },
    });
  }

  // Function to handle edge selection
  onEdgeSelect(selectedValue: Edge) {
    this.selectedEdge = selectedValue;
    this.datasets = []; // Clear existing data when edge changes
    this.labels = []; // Clear existing labels when edge changes
    this.fetchData(); // Fetch data for the selected edge
  }

  onTimeFrameSelect(selectedValue: TimeFrame) {
    this.selectedTimeFrame = selectedValue;
    this.datasets = []; // Clear existing data when time frame changes
    this.labels = []; // Clear existing labels when time frame changes
    this.fetchData(); // Fetch data for the selected time frame
  }

  getMappedLabel(originalLabel: string): string {
    console.log(this.labelMapping[originalLabel] || originalLabel);
    return this.labelMapping[originalLabel] || originalLabel; // Return original if no mapping found
  }

  getChartHeight(): number {
    return 700;
  }

  exportToXlxs(): void {
    // Logic to export data to XLSX format if required.
  }

  getRandomColor(): string {
    const color = this.chartColors[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.chartColors.length; // Cycle through the colors
    return color;
  }

  getBackgroundColorFromBorderColor(colorName: string): string {
    const colorMapping: { [key: string]: string } = {
      red: 'rgba(255, 0, 0, 0.2)',
      blue: 'rgba(0, 0, 255, 0.2)',
      green: 'rgba(0, 128, 0, 0.2)',
      purple: 'rgba(128, 0, 128, 0.2)',
    };

    return colorMapping[colorName] || colorName; // If the color name isn't in the mapping, return the original color name
  }
}
