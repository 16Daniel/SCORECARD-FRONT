import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-comparativa-ventas',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './comparativa-ventas.html',
  styleUrl: './comparativa-ventas.scss',
})
export class ComparativaVentas implements OnChanges {
  @Input() dataventas: any[] = [];
  @Input() tipo: number = 0;

  public multi: any[] = [];

  // opciones de la gráfica
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'FECHA';
  yAxisLabel: string = 'VENTA';
  timeline: boolean = true;

  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Solo procesar si realmente cambiaron dataventas o tipo
    if ((changes['dataventas'] || changes['tipo']) && this.dataventas?.length) {
      this.actualizarGrafica();
    }
  }

  private actualizarGrafica(): void {
    this.multi = []; 
    const nuevaSeriePresupuesto = [];
    const nuevaSerieVentaReal = [];

    for (let i = 0; i < this.dataventas.length; i++) {
      const fecha = this.dataventas[i][1]; // asumiendo que la fecha está en el índice 1
      let valorPresupuesto = 0;
      let valorReal = 0;

      // Asignación según el tipo
      if (this.tipo === 1) {
        valorPresupuesto = this.dataventas[i][6];
        valorReal = this.dataventas[i][7];
      } else if (this.tipo === 2) {
        valorPresupuesto = this.dataventas[i][4];
        valorReal = this.dataventas[i][8];
      } else if (this.tipo === 3) {
        valorPresupuesto = this.dataventas[i][5];
        valorReal = this.dataventas[i][9];
      } else if (this.tipo === 4) {
        valorPresupuesto = this.dataventas[i][2];
        valorReal = this.dataventas[i][7];
      }

      nuevaSeriePresupuesto.push({ name: fecha, value: valorPresupuesto });
      nuevaSerieVentaReal.push({ name: fecha, value: valorReal });
    }

    this.multi = [
      { name: 'PRESUPUESTO', series: nuevaSeriePresupuesto },
      { name: 'VENTA REAL', series: nuevaSerieVentaReal }
    ];

    // Forzar actualización de la vista
    this.cdr.detectChanges();
  }
}