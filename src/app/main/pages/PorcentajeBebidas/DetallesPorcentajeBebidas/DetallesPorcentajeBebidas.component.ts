import { ChangeDetectorRef, Component, input, Input, type OnInit } from '@angular/core';
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
@Input() promedio:number = 0; 
@Input() data:any[] = []; 

public colorespersonalizados:any[] = [];                         

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
    
    customColorsC = (name:string): string => {
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

        if(name == 'PROMEDIO DEL GRUPO')
          {
            color = '#bebebe'; 
          }
        return color;
    };


    customColors = (id:string): string => {
      let temp = this.colorespersonalizados.filter(x=> x.id = id); 
      let color = temp.length>0 ? temp[0].color : '';  
      return color; 
    };

    constructor(public cdr:ChangeDetectorRef
    ){}

  ngOnInit(): void 
  {
    this.datag = []; 
    this.colorespersonalizados = []; 
    for(let item of this.data)
      {
        let serie:any[] = [];  
        let porcentaje = 0; 
        let promedio = 0;
        let esmayor:boolean = false;  
        if(item.alimentos >0)
          {
            porcentaje = (item.bebidas/item.alimentos)*100;
          }
         this.datag.push({name:"W"+item.semana,value:porcentaje}); 
          // let temp = this.promedios.filter(x => x.semana == item.semana); 
          // promedio = temp.length>0 ? temp[0].promedio : 0;  
          // if(porcentaje>= promedio)
          //   {
          //     esmayor = true; 
          //   }

          //   let val1= 0; let val2=0;
          //   let strval1 = '', strval2 = '';  
          //   if(esmayor)
          //     {
          //       val2 = porcentaje-promedio;
          //       val1 = promedio; 
          //       strval1 = 'PROMEDIO';
          //       strval2 =  'SUPERIOR'
          //     } else
          //     {
          //       val2 = promedio-porcentaje; 
          //       val1 = porcentaje; 
          //        strval1 = 'PORCENTAJE';
          //       strval2 =  'FALTANTE'
          //     }

          //     let colorbarra = this.getColorBarra(porcentaje); 

          //     this.colorespersonalizados.push({id:'W'+item.semana+'-1-'+strval1,color:colorbarra});
          //     this.colorespersonalizados.push({id:'W'+item.semana+'-2-'+strval2,color: esmayor ? colorbarra : '#9a9a9a'});

          //     serie.push({name:'W'+item.semana+'-1-'+strval1,value:val1});
          //     serie.push({name:'W'+item.semana+'-2-'+strval2,value:val2});
          //     this.datag.push({name:'W'+item.semana,series:serie});
      }
      this.datag.push({name:"PROMEDIO DEL GRUPO",value:this.promedio}); 
   }

  formatDataLabel(value: number, label: string, series: any) {
    // value = Math.round(value); 
     return `${value.toFixed(2)}%`;
   }


   getColorBarra(porcentaje:number)
   {
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

}
