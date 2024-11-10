import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
  } from "@angular/core";
  import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexYAxis,
    ChartComponent
  } from "ng-apexcharts";
  
  export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
  };
  
  @Component({
    selector: "radarchart",
    templateUrl: "./radarchart.component.html",
    styleUrls: ["./radarchart.component.css"]
  })
  export class RadarchartComponent implements OnChanges {
    @ViewChild("chart") chart!: ChartComponent;
    @Input() categories!: string[];
    @Input() data!: number[];
  
    public chartOptions: Partial<ChartOptions> | any;
  
    constructor() {
      this.chartOptions = {
        series: [
          {
            name: "Series 1",
            data: [80, 50, 30, 40, 100, 20]
          }
        ],
        chart: {
        height: 350,
          type: "radar",
          toolbar: {
            show: false
          },
          fontFamily: 'Saira'
        },
        yaxis:{
            show: false
        },
        xaxis: {
          categories: ["A", "B", "C", "D", "E", "F"]
        },
        markers: {
            size: 0,
        }
      };
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes["categories"] || changes["data"]) {
        this.updateChart();
      }
    }
  
    updateChart() {
  
      this.chartOptions.series = [
        {
          name: "Series 1",
          data: this.data
        }
      ];
      this.chartOptions.xaxis = {
        categories: this.categories
      };
    }
  }
  