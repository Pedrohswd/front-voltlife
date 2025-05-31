
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subscription } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HttpClient } from '@angular/common/http';
import { HouseService } from 'src/app/services/house.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {

  lineData: any;
  barData: any;
  pieData: any;
  polarData: any;
  radarData: any;

  lineOptions: any;
  barOptions: any;
  pieOptions: any;
  polarOptions: any;
  radarOptions: any;

  subscription: Subscription;

  constructor(
    private layoutService: LayoutService,
    private houseService: HouseService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => {
      });
  }

  ngOnInit() {
    this.fetchReportData();
  }

 fetchReportData() {
    this.houseService.getReportsByHouseId(1).subscribe((data) => {
      const labels = data.map(d => new Date(d.requestAt).toLocaleTimeString());
      const paData = data.map(d => d.pa);
      const temperaturaData = data.map(d => d.temperatura);

      this.lineData = {
        labels,
        datasets: [
          {
            label: 'Potência Ativa (PA)',
            data: paData,
            fill: false,
            backgroundColor: '#42A5F5',
            borderColor: '#42A5F5',
            tension: .4
          },
          {
            label: 'Temperatura Ambiente (°C)',
            data: temperaturaData,
            fill: false,
            backgroundColor: '#FFA726',
            borderColor: '#FFA726',
            tension: .4
          }
        ]
      };

      this.lineOptions = {
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
            },
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border'),
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
            },
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border'),
              drawBorder: false
            }
          }
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}