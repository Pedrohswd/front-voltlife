import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subscription } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HouseService } from 'src/app/services/house.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ChartModule, CalendarModule, MultiSelectModule, ButtonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {
  // Gráficos
  lineData: any;
  barData: any;
  pieData: any;
  polarData: any;
  radarData: any;
  barDiaSemanaData: any;
  doughnutTimeData: any;
  tempVsKwhData: any;
  tempPorDiaSemanaData: any;

  // Opções dos Gráficos
  lineOptions: any;
  barOptions: any;
  pieOptions: any;
  polarOptions: any;
  radarOptions: any;
  barDiaSemanaOptions: any;
  doughnutTimeOptions: any;
  tempVsKwhOptions: any;
  tempPorDiaSemanaOptions: any;

  // Métricas de Resumo
  mediaTemperatura = 0;
  mediaConsumoHora = 0;
  mediaUmidade = 0;
  mediaTensao = 0;

  // Filtros
  filtros = {
    aparelhosSelecionados: [] as string[],
    dataInicial: null as Date | null,
    dataFinal: null as Date | null
  };
  aparelhoOptions: { label: string; value: string }[] = [];

  subscription: Subscription;

  constructor(
    private layoutService: LayoutService,
    private houseService: HouseService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => { });
  }

  ngOnInit() {
    this.fetchReportData();
  }

  aplicarFiltros() {
    this.fetchReportData();
  }

  fetchReportData() {
    this.houseService.getReportsByHouseId(1).subscribe((data) => {
      const dadosFiltrados = data.filter(d => {
        const dataRegistro = new Date(d.requestAt);
        console.log('Selecionados:', this.filtros.aparelhosSelecionados);
        console.log('Dispositivo exemplo:', d.idDsp);
        const aparelhoValido = !this.filtros.aparelhosSelecionados.length || this.filtros.aparelhosSelecionados.includes(d.idDsp);
        const dataInicialValida = !this.filtros.dataInicial || dataRegistro >= this.filtros.dataInicial;
        const dataFinalValida = !this.filtros.dataFinal || dataRegistro <= this.filtros.dataFinal;
        return aparelhoValido && dataInicialValida && dataFinalValida;
      });


      console.log(data)
      console.log(dadosFiltrados)

      const labels = dadosFiltrados.map(d => new Date(d.requestAt).toLocaleTimeString());
      const paData = dadosFiltrados.map(d => d.consumoHora);
      const temperaturaData = dadosFiltrados.map(d => d.temperatura);

      // Inicialização
      const consumoPorAparelho: { [idDsp: string]: number } = {};
      const consumoPorClima: { [weather: string]: number } = {};
      const consumoPorPeriodo = { '00h-06h': 0, '06h-12h': 0, '12h-18h': 0, '18h-00h': 0 };
      const consumoPorDiaSemana: { [dia: string]: number[] } = {
        'Dom': [], 'Seg': [], 'Ter': [], 'Qua': [], 'Qui': [], 'Sex': [], 'Sáb': []
      };
      const temperaturaPorDiaSemana: { [dia: string]: number[] } = {
        'Dom': [], 'Seg': [], 'Ter': [], 'Qua': [], 'Qui': [], 'Sex': [], 'Sáb': []
      };
      const metricasResumo = { temperatura: 0, umidade: 0, tensao: 0, consumo: 0, registros: 0 };

      // Processamento de dados
      const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      dadosFiltrados.forEach(d => {
        consumoPorAparelho[d.idDsp] = (consumoPorAparelho[d.idDsp] || 0) + d.consumoHora;
        if (d.weatherMain !== null) {
          consumoPorClima[d.weatherMain] = (consumoPorClima[d.weatherMain] || 0) + d.consumoHora;
        }

        metricasResumo.temperatura += d.temperatura;
        metricasResumo.umidade += d.humidity;
        metricasResumo.tensao += d.uarms;
        metricasResumo.consumo += d.consumoHora;
        metricasResumo.registros++;

        const hora = new Date(d.requestAt).getHours();
        if (hora < 6) consumoPorPeriodo['00h-06h'] += d.consumoHora;
        else if (hora < 12) consumoPorPeriodo['06h-12h'] += d.consumoHora;
        else if (hora < 18) consumoPorPeriodo['12h-18h'] += d.consumoHora;
        else consumoPorPeriodo['18h-00h'] += d.consumoHora;

        const diaSemana = new Date(d.requestAt).getDay();
        consumoPorDiaSemana[nomes[diaSemana]].push(d.consumoHora);
        temperaturaPorDiaSemana[nomes[diaSemana]].push(d.temperatura);
      });

      this.aparelhoOptions = Object.keys(consumoPorAparelho).map(key => ({
        label: key,
        value: key
      }));

      const tempMediasPorDia = nomes.map(dia => {
        const temps = temperaturaPorDiaSemana[dia];
        return temps.length ? +(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2) : 0;
      });
      const avg = (v: number) => +(v / metricasResumo.registros).toFixed(2);
      this.mediaTemperatura = avg(metricasResumo.temperatura);
      this.mediaConsumoHora = avg(metricasResumo.consumo);
      this.mediaUmidade = avg(metricasResumo.umidade);
      this.mediaTensao = avg(metricasResumo.tensao);

      const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const mediasPorDia = dias.map(d => {
        const valores = consumoPorDiaSemana[d];
        return valores.length ? +(valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2) : 0;
      });

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.tempPorDiaSemanaData = {
        labels: dias,
        datasets: [{
          label: 'Temperatura Média (°C)',
          data: tempMediasPorDia,
          backgroundColor: documentStyle.getPropertyValue('--orange-500')
        }]
      };

      this.tempPorDiaSemanaOptions = {
        plugins: { legend: { labels: { color: textColor } } },
        scales: {
          x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
          y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
        }
      };

      this.barDiaSemanaData = {
        labels: dias,
        datasets: [{
          label: 'Consumo Médio (kWh)',
          data: mediasPorDia,
          backgroundColor: documentStyle.getPropertyValue('--cyan-500')
        }]
      };

      this.barDiaSemanaOptions = {
        plugins: { legend: { labels: { color: textColor } } },
        scales: {
          x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
          y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
        }
      };

      const aparelhoLabels = Object.keys(consumoPorAparelho);
      const consumoValores = Object.values(consumoPorAparelho);

      this.barData = {
        labels: aparelhoLabels,
        datasets: [{
          label: 'Consumo Total (kWh)',
          data: consumoValores,
          backgroundColor: aparelhoLabels.map((_, i) => documentStyle.getPropertyValue(`--blue-${(i + 1)}`) || '#42A5F5')
        }]
      };

      this.pieData = {
        labels: aparelhoLabels,
        datasets: [{
          data: consumoValores,
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--teal-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--bluegray-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--indigo-400'),
            documentStyle.getPropertyValue('--purple-400'),
            documentStyle.getPropertyValue('--teal-400'),
            documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--bluegray-400')
          ]
        }]
      };

      this.polarData = {
        labels: Object.keys(consumoPorClima),
        datasets: [{
          label: 'Consumo por Clima (kWh)',
          data: Object.values(consumoPorClima),
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--cyan-500'),
            documentStyle.getPropertyValue('--amber-500')
          ]
        }]
      };

      this.polarOptions = {
        plugins: { legend: { labels: { color: textColor } } },
        scales: { r: { grid: { color: surfaceBorder } } }
      };

      this.doughnutTimeData = {
        labels: Object.keys(consumoPorPeriodo),
        datasets: [{
          data: Object.values(consumoPorPeriodo),
          backgroundColor: [
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--pink-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--bluegray-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--pink-400')
          ]
        }]
      };

      this.doughnutTimeOptions = {
        plugins: { legend: { labels: { color: textColor } } }
      };

      this.lineData = {
        labels,
        datasets: [
          {
            label: 'Consumo (kw/h)',
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
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}