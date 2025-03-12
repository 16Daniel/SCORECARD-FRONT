import { Component, input, Input, type OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Sucursal } from '../../../../Interfaces/Sucursal';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detalles-porcentaje-bebidas',
  standalone: true,
  imports: [
    NgxChartsModule,
    CommonModule
  ],
  templateUrl: './DetallesPorcentajeBebidas.component.html',
})
export class DetallesPorcentajeBebidasComponent implements OnInit {
@Input() sucursal:Sucursal|undefined = undefined; 
@Input() data:any[] = []; 

  showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    legendPosition: string = 'below';
    showXAxisLabel: boolean = true;
    yAxisLabel: string = 'SEMANA';
    showYAxisLabel: boolean = true;
    xAxisLabel = '';
  
    public datag:any[] = [];

    colorScheme:any = {
      domain: [
        "#00FF00", // Verde fuerte
        "#FFFF00", // Amarillo
        "#FF0000",  // Rojo
        "#4e1eff", // Morado
      ]
    };
    
    customColorsc = (name:number): string => {
      let Sucursal = this.datag.filter(x=>x.name == name);
      let porcentaje= Sucursal[0].value;
  

      let color = '#6D28D9'; 
      if(porcentaje<40)
        {
          color = '#d9003e';
        }
  
      if(porcentaje>=40)
        {
          color = '#39df18';
        }
        return color;
    };

  ngOnInit(): void 
  {
    this.datag = []; 
    for(let item of this.data)
      {
        let porcentaje = 0; 
        if(item.alimentos >0)
          {
            porcentaje = (item.bebidas/item.alimentos)*100;
          }
        this.datag.push({name:"W"+item.semana,value:porcentaje}); 

      }
   }

  formatDataLabel(value: number, label: string, series: any) {
    // value = Math.round(value); 
     return `${value.toFixed(2)}%`;
   }

   

}
