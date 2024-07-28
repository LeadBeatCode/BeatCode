import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
};

@Component({
  selector: "win-rate-radialbar",
  templateUrl: "./win-rate-radialbar.component.html",
  styleUrls: ["./win-rate-radialbar.component.css"]
})
export class WinRateRadialbarComponent implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  @Input() wins!: number;
  @Input() losses!: number;

  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.chartOptions = {
      chart: {
        height: 250,
        type: "radialBar"
      },
      series: [0],
      colors: ["#29fffb"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            background: "#293450",
            size: "70%"
          },
          dataLabels: {
            name: {
              offsetY: -5,
              color: "#fff",
              fontSize: "14px",
              fontFamily: 'Saira'
            },
            value: {
              offsetY: 0,
              color: "#fff",
              fontSize: "18px",
              show: true,
              fontFamily: 'Saira'
            }
          }
        }
      },
      labels: ["WIN RATES"],
      stroke: {
        lineCap: "round"
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["wins"] || changes["losses"]) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.updateChart();
  }

  updateChart() {
    const totalGames = this.wins + this.losses;
    const winRate = (totalGames > 0 ? (this.wins / totalGames) * 100 : 0).toFixed(2);
    this.chartOptions.series = [winRate];
  }
}