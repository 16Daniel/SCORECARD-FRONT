import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { InicioAYC } from '../../Interfaces/InicioAYC.';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sucursal-inicio-ayc',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './SucursalInicioAYC.component.html',
})
export class SucursalInicioAYCComponent implements OnInit {
  @Input() arr_iniciosayc:InicioAYC[] = [];
  @Input() parametrosjdata:string = "";

public iniwings:number = 0;
public iniboneless:number = 0; 
public iniburger:number = 0; 
public inihotdog:number = 0; 

public semanas:number=0; 

  public mgd:any = []; 
  public mgpw:any = []; 
  public mgpb:any = []; 
  public mgphb:any = []; 
  public pgdc:any = []; 

  public gtpw:any[] = []; 
  public gtpb:any[] = []; 
  public gtphb:any[] = []; 

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'SEMANA';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'CANTIDAD';

  colorSchemedetApp:any = {
    domain: [
      "#ff04dd",
      "#7a04ff",
      "#1E90FF"
    ]
  }

  constructor(public cdr:ChangeDetectorRef)
  {
   
  }

  ngOnInit(): void 
  {
    console.log(this.parametrosjdata);

    if(this.parametrosjdata!="")
      {
        var obj = JSON.parse(this.parametrosjdata); 
        this.iniwings = obj.iniwings;
        this.iniboneless = obj.iniboneless;
        this.iniburger = obj.iniburger; 
        this.inihotdog = obj.inihotdog;     
      }
    const semanas = this.arr_iniciosayc.map(item => item.semana);
    const semanasUnicas:number[] = Array.from(new Set(semanas));
    this.semanas = semanasUnicas.length; 
    console.log(semanasUnicas); 
    for(let numsem of semanasUnicas)
      {
        let series:any[]=[]; 
        let series2:any[]=[]; 
        let series3:any[]=[]; 
        let datasem:InicioAYC[] = this.arr_iniciosayc.filter(x=> x.semana == numsem); 

       let wings = datasem.reduce((acumulador, elemento) => {
          if (elemento.orden == 1) {
            return acumulador + elemento.udsTotales;
          } else {
            return acumulador;
          }
        }, 0);

        let boneless = datasem.reduce((acumulador, elemento) => {
          if (elemento.orden == 2) {
            return acumulador + elemento.udsTotales;
          } else {
            return acumulador;
          }
        }, 0);

      let hotdogs = datasem.reduce((acumulador, elemento) => {
          if (elemento.orden == 4) {
            return acumulador + elemento.udsTotales;
          } else {
            return acumulador;
          }
        }, 0);

      let burgers = datasem.reduce((acumulador, elemento) => {
          if (elemento.orden == 3) {
            return acumulador + elemento.udsTotales;
          } else {
            return acumulador;
          }
        }, 0);
        
        series.push({name:"WINGS",value:wings});
        series.push({name:"BONELESS",value:boneless});
        series.push({name:"HOT-DOG/BURGER",value:burgers+hotdogs});
        //series.push({name:"HOT-DOG",value:hotdogs});

        this.mgd.push({name:numsem.toString(),series:series});

        let totaluds = wings + boneless + burgers + hotdogs; 
        let porcentajeWings = (wings/totaluds)*100;
        let porcentajeBoneless = (boneless/totaluds)*100
        let porcentajeBurger = (burgers/totaluds)*100
        let porcentajeHotdog = (hotdogs/totaluds)*100
        
        series2.push({name:"WINGS",value:porcentajeWings});
        series2.push({name:"BONELESS",value:porcentajeBoneless});
        series2.push({name:"HOT-DOG/BURGER",value:porcentajeBurger+porcentajeHotdog});
      //  series2.push({name:"HOT-DOG",value:porcentajeHotdog});

        this.mgpw.push({name:numsem.toString(),value:porcentajeWings});
        this.mgpb.push({name:numsem.toString(),value:porcentajeBoneless});
        this.mgphb.push({name:numsem.toString(),value:porcentajeBurger+porcentajeHotdog});

        // porcentajes de cumplimineto 

        let cumplimientowings = (porcentajeWings/this.iniwings)*100;
        let cumplimientoboneless = (porcentajeBoneless/this.iniboneless)*100;
        let cumplimientohotburger = ((porcentajeHotdog+porcentajeBurger)/(this.inihotdog+this.iniburger))*100;

        series3.push({name:"WINGS",value:cumplimientowings});
        series3.push({name:"BONELESS",value:cumplimientoboneless});
        series3.push({name:"HOT-DOG/BURGER",value:cumplimientohotburger});

        this.pgdc.push({name:numsem.toString(),series:series3});

        this.gtpw.push({name:numsem.toString(),value:cumplimientowings});
        this.gtpb.push({name:numsem.toString(),value:cumplimientoboneless});
        this.gtphb.push({name:numsem.toString(),value:cumplimientohotburger});

      }

      
      this.cdr.detectChanges();

   }

   getbgdet(porcentaje:number)
   {
     let color = '';
       if(porcentaje<75)
         {
           color ='#d9003e';  
         }
   
       if(porcentaje<100 && porcentaje>=75)
             {
               color = '#ffc500';
             }
   
       if(porcentaje>=100)
         {
           color = '#39df18';
         }
       return color; 
   }

   getcolotext(porcentaje:number)
   {
     let color = '';
       if(porcentaje<75)
         {
           color ='#fff';  
         }
   
       if(porcentaje<100 && porcentaje>=75)
             {
               color = '#000';
             }
   
       if(porcentaje>=100)
         {
           color = '#fff';
         }
       return color; 
   }


  customColorsw():any {
    
    let colores:string[] = [];

    for(let item of this.gtpw)
      {
        let color;
        if (item.value <75) {
          color = '#39df18'; // Verde
        } else if (item.value<100 && item.value>=75) {
          color = '#ffc500'; // Naranja
        } else {
          color = '#dc0000'; // Rojo
        }

        colores.push(color);
      }

      return {
        domain:colores
      }
  }

  customColorsb():any {
    let colores:string[] = [];

    for(let item of this.gtpb)
      {
        let color;
        if (item.value <75) {
          color = '#39df18'; // Verde
        } else if (item.value<100 && item.value>=75) {
          color = '#ffc500';
        } else {
          color = '#d40000'; // Rojo
        }

        colores.push(color);
      }

      return {
        domain:colores
      }
  }

  customColorshb():any {
    let colores:string[] = [];

    for(let item of this.gtphb)
      {
        let color;
        if (item.value <75) {
          color = '#d40000'; // Rojo
        } else if (item.value<100 && item.value>=75) {
          color = '#ffc500'; // Naranja
        } else {
          color = '#39df18'; // Verde
        }

        colores.push(color);
      }

      return {
        domain:colores
      }
  }

  customColorgcb():any {
    let colores:string[] = [];

    for(let sem of this.pgdc)
      {
        for(let item of sem.series)
          {
            let color;
            if (item.value <75) {
              color = '#d40000'; // Rojo
            } else if (item.value<100 && item.value>=75) {
              color = '#ffc500'; // Naranja
            } else {
              color = '#39df18'; // Verde
            }
    
            colores.push(color);
          }
      }

      return {
        domain:colores
      }
  }

  formatDataLabel(value: number): string {
    //value = Math.round(value);
    return `${value.toFixed(2)}%`;
  }

}
