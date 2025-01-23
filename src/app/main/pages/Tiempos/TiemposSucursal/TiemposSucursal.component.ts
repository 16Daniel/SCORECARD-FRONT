import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { TiemposRango, TiemposSuc } from '../../../../Interfaces/Tiempos.';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-tiempos-sucursal',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './TiemposSucursal.component.html',
})
export class TiemposSucursalComponent implements OnInit {
  @Input() data:TiemposSuc|undefined;
  public semanas:number = 0; 
    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    legendPosition: string = 'below';
    showXAxisLabel: boolean = true;
    yAxisLabel: string = 'SEMANA';
    showYAxisLabel: boolean = true;
    xAxisLabel = '';
  
    colorScheme:any = {
      domain: [
        
        "#00FF00", // Verde fuerte
        "#FFFF00", // Amarillo
        "#FF0000",  // Rojo
        "#4e1eff", // Morado
      ]
    };
    
  public multi:any[] = [];
  public data2:any[] = []; 

  constructor(public cdr:ChangeDetectorRef){}

  ngOnInit(): void 
  {
    const semanas = this.data!.rangos.map(item => item.semana);
    const semanasUnicas:number[] = Array.from(new Set(semanas));
    this.semanas = semanasUnicas.length; 

    for(let numsem of semanasUnicas)
      {
        let series:any[] = []; 
        
        let datasem:TiemposRango[] = this.data!.rangos.filter(x=> x.semana == numsem); 

        let rsinconexion = datasem.reduce((acumulador, elemento) => {
           if (elemento.rango == 'SIN CONEXION') {
             return acumulador + elemento.total;
           } else {
             return acumulador;
           }
         }, 0);

         let r1 = datasem.reduce((acumulador, elemento) => {
          if (elemento.rango == '0-10') {
            return acumulador + elemento.total;
          } else {
            return acumulador;
          }
        }, 0);
      
        let r2 = datasem.reduce((acumulador, elemento) => {
          if (elemento.rango == '11-15') {
            return acumulador + elemento.total;
          } else {
            return acumulador;
          }
        }, 0);

        let r3 = datasem.reduce((acumulador, elemento) => {
          if (elemento.rango == '16-20') {
            return acumulador + elemento.total;
          } else {
            return acumulador;
          }
        }, 0);

        let r4 = datasem.reduce((acumulador, elemento) => {
          if (elemento.rango == '21-25') {
            return acumulador + elemento.total;
          } else {
            return acumulador;
          }
        }, 0);

        let r5 = datasem.reduce((acumulador, elemento) => {
          if (elemento.rango == '26-30') {
            return acumulador + elemento.total;
          } else {
            return acumulador;
          }
        }, 0);

      
        series.push({name:"0-10",value:r1}); 
        series.push({name:"11-15",value:r2}); 
        series.push({name:"16-30",value:r3+r4+r5}); 
        series.push({name:"SIN CONEXION",value:rsinconexion}); 

        this.multi.push({name:numsem.toString(),series:series});
        
      }   
      //this.multi.sort((a, b) => b.series[0].value - a.series[0].value);
      this.cdr.detectChanges(); 

   }


   formatDataLabel(value: any, label: string, series: any) {
    debugger
    return `${label}: ${value.toLocaleString()}`;
  }

}
