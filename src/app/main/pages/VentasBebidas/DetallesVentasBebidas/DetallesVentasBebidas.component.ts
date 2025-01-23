import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { VentaBebida } from '../../../../Interfaces/VentaBebida.';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-detalles-ventas-bebidas',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './DetallesVentasBebidas.component.html',
})
export class DetallesVentasBebidasComponent implements OnInit {
  @Input() data:VentaBebida[] = [];

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
  

  public datag2:any[] = []; 

  customColorsrl = (name:number): string => {
    let Sucursal = this.datag2.filter(x=>x.name == name);
    let porcentaje= Sucursal[0].value;
    let color = '#6D28D9'; 
    if(porcentaje<5)
      {
        color = '#d9003e';
      }

    if(porcentaje<8 && porcentaje>=5)
          {
            color = '#ffc500';
          }

    if(porcentaje>=8)
      {
        color = '#39df18';
      }
      return color;
  };
  customColorsc = (name:number): string => {
    let Sucursal = this.datag.filter(x=>x.name == name);
    let porcentaje= Sucursal[0].value;


    let color = '#6D28D9'; 
    if(porcentaje<20)
      {
        color = '#d9003e';
      }

    if(porcentaje<25 && porcentaje>=20)
          {
            color = '#ffc500';
          }

    if(porcentaje>=25)
      {
        color = '#39df18';
      }
      return color;
  };
  
  ngOnInit(): void
   { 
      for(let item of this.data)
        {
          let pcervezas = 0; 
          let prebellitros = 0; 

          if(item.cerveza>0 && item.salon>0)
            {
              pcervezas = (item.cerveza/item.salon)*100; 
            }
         
            if(item.rebelitros>0 && item.salon>0)
              {
                prebellitros = (item.rebelitros/item.salon)*100; 
              }

          this.datag.push({name:item.semana,value:pcervezas});
          this.datag2.push({name:item.semana,value:prebellitros});
        }
   }


   formatDataLabel(value: number, label: string, series: any) {
    // value = Math.round(value); 
     return `${value.toFixed(2)}%`;
   }

}
