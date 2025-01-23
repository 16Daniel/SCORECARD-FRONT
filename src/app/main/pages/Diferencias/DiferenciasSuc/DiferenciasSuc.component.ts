import { CommonModule,DatePipe } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { Diferencia } from '../../../../Interfaces/Diferencia';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-diferencias-suc',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
  ],
  providers:[DatePipe],
  templateUrl: './DiferenciasSuc.component.html',
})
export class DiferenciasSucComponent implements OnInit {
  @Input() data:Diferencia[] = [];
  @Input() dataSemana:boolean = false;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = this.dataSemana == true ? 'SEMANA':'FECHA';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = '';
  colorScheme:any = {
    domain: ['#00f7ff', '#ff00f7 ', '#ff3a00', '#aae3f5']
  };
  public datag:any[] = [];
  public dataga:any[] = [];
  public datagb:any[] = [];
  public datagp:any[] = [];

  constructor(private datePipe: DatePipe){}
  ngOnInit(): void
  {
    this.datag=[]; 
    const semanas = this.data.map(item => item.semana);
    const semanasUnicas:number[] = Array.from(new Set(semanas));

   if(this.dataSemana == true)
    {  
          for(let numsemana of semanasUnicas)
            {
              let datasem = this.data.filter(x=> x.semana == numsemana); 
              let t_d_a = datasem.reduce((acumulador:number, elemento) => {
                if(elemento.codart == 158)
                  {
                    return acumulador + parseFloat(elemento.diferencia.toString());
                  } else 
                  {
                    return acumulador; 
                  }
            }, 0);

            let t_d_b = datasem.reduce((acumulador:number, elemento) => {
              if(elemento.codart == 10183)
                {
                  return acumulador + parseFloat(elemento.diferencia.toString());
                } else 
                {
                  return acumulador; 
                }
          }, 0);

              let t_d_p = datasem.reduce((acumulador:number, elemento) => {
                if(elemento.codart == 10193)
                  {
                    return acumulador + parseFloat(elemento.diferencia.toString());
                  } else 
                  {
                    return acumulador; 
                  }
            }, 0);

            this.dataga.push({name:'SEMANA '+numsemana,value:t_d_a});
            this.datagb.push({name:'SEMANA '+numsemana,value:t_d_b});
            this.datagp.push({name:'SEMANA '+numsemana,value:t_d_p});
          }
                    
    } else
    {
      for(let item of this.data)
        {
            if(item.codart == 158)
              {
                this.dataga.push({name:this.datePipe.transform(item.fecha, 'dd-MM-yyyy'),value:parseFloat(item.diferencia.toString())});
              }
              if(item.codart == 10183)
                {
                  this.datagb.push({name:this.datePipe.transform(item.fecha, 'dd-MM-yyyy'),value:parseFloat(item.diferencia.toString())});
                }
  
                if(item.codart == 10193)
                  {
                    this.datagp.push({name:this.datePipe.transform(item.fecha, 'dd-MM-yyyy'),value:parseFloat(item.diferencia.toString())});
                  }
        }
    }

   }


   customColorsa = (name:number): string => {
    let Sucursal = this.dataga.filter(x=>x.name == name);
    let diferencia= Sucursal[0].value;

    let color = '#6D28D9'; 

      if(this.dataSemana)
        {
          if(diferencia>-(6*7) && diferencia<(6*7))
            {
              color = '#39df18';
              
            }
      
          if((diferencia>=-(10*7) && diferencia<=-(6*7)) || (diferencia<=(10*7) && diferencia>=(6*7)))
                {
                  color = '#ffc500';
                }
      
          if(diferencia<-(10*7) || diferencia>(10*7))
            {
              color = '#d9003e';
            }
        }
        else
        {
          if(diferencia>-6 && diferencia<6)
            {
              color = '#39df18';
              
            }
      
          if((diferencia>=-10 && diferencia<=-6) || (diferencia<=10 && diferencia>=6))
                {
                  color = '#ffc500';
                }
      
          if(diferencia<-10 || diferencia>10)
            {
              color = '#d9003e';
            }
        }
      return color;
  };


  customColorsaSemana = (name:number): string => {
    let Sucursal = this.dataga.filter(x=>x.name == name);
    let diferencia= Sucursal[0].value;

    let color = '#6D28D9'; 
    if(diferencia>-(6*7) && diferencia<(6*7))
      {
        color = '#39df18';
        
      }

    if((diferencia>=-(10*7) && diferencia<=-(6*7)) || (diferencia<=(10*7) && diferencia>=(6*7)))
          {
            color = '#ffc500';
          }

    if(diferencia<-(10*7) || diferencia>(10*7))
      {
        color = '#d9003e';
      }
      return color;
  };

  customColorsb = (name:number): string => {
    let Sucursal = this.datagb.filter(x=>x.name == name);
    let diferencia= Sucursal[0].value;

    let color = '#6D28D9'; 
    if(diferencia>-6 && diferencia<6)
      {
        color = '#39df18';
        
      }

    if((diferencia>=-10 && diferencia<=-6) || (diferencia<=10 && diferencia>=6))
          {
            color = '#ffc500';
          }

    if(diferencia<-10 || diferencia>10)
      {
        color = '#d9003e';
      }
      return color;
  };

  customColorsp = (name:number): string => {
    let Sucursal = this.datagp.filter(x=>x.name == name);
    let diferencia= Sucursal[0].value;

    let color = '#6D28D9'; 
    if(diferencia>-6 && diferencia<6)
      {
        color = '#39df18';
        
      }

    if((diferencia>=-10 && diferencia<=-6) || (diferencia<=10 && diferencia>=6))
          {
            color = '#ffc500';
          }

    if(diferencia<-10 || diferencia>10)
      {
        color = '#d9003e';
      }
      return color;
  };

}
