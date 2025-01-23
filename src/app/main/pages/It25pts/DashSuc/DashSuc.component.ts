import { Component, Input, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboardsuc } from '../../../../Interfaces/Dashboardsuc';
import { CompraArt, MermasDS } from '../../../../Interfaces/Merma';
import { It25pts } from '../../../../Interfaces/25Pts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Sucursal } from '../../../../Interfaces/Sucursal';
import { DiferenciasSucComponent } from "../../Diferencias/DiferenciasSuc/DiferenciasSuc.component";
import { Diferencia } from '../../../../Interfaces/Diferencia';
@Component({
  selector: 'app-dash-suc',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    DiferenciasSucComponent
],
  templateUrl: './DashSuc.component.html',
})
export class DashSucComponent implements OnInit {
  @Input() data:Dashboardsuc|undefined;
  @Input() datasuc:Sucursal|undefined;
    
  public arr_data:It25pts[] = []; 
  public datagS:any[] = []; 
  public datagS2:any[] = []; 
  public dataT:any[] = []; 
  public itemt:any[] = []; 
  public datavend:any[] = []; 
  public datagmermasA:any[] = [];
  public datagmermasB:any[] = []; 
  public datamermas:MermasDS[] = []; 
  fechainicial:Date = new Date(); 
  fechafinal:Date = new Date(); 


  public datamermalisto:boolean = false; 
  public diferenciaslisto:boolean = false; 

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition:LegendPosition = LegendPosition.Below;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'SEMANAS';
  showYAxisLabel: boolean = true;
  xAxisLabel = '';
  lgp:LegendPosition = LegendPosition.Below; 

  colorScheme:any = {
    domain: [
      "#39FF14", // Verde neón
      "#FF073A", // Rojo neón
      "#FFFF00", // Amarillo neón
      "#00FFFF", // Cian neón
      "#FF00FF", // Magenta neón
      "#FF4500", // Naranja neón
      "#00FF7F", // Verde neón claro
      "#8A2BE2", // Azul neón
      "#FF1493", // Rosa neón
      "#FFD700", // Oro neón
      "#ADFF2F", // Verde neón amarillo
      "#FF6347", // Tomate neón
      "#00BFFF", // Azul profundo neón
      "#FF8C00", // Naranja oscuro neón
      "#7FFF00", // Chartreuse neón
      "#D2691E", // Chocolate neón
      "#FF00FF", // Fucsia neón
      "#00CED1", // Turquesa neón
      "#FF1493", // Rosa profundo neón
      "#FF6347"  // Tomate neón
    ]
  };

  colorSchemeGM:any = {
    domain: [
      "#8A2BE2", // Azul neón
      "#FF1493", // Rosa neón

    ]
  };

  colorSchemeS:any = {
    domain: [
      "#ffee00", // Neón verde
    ]
  };



  ngOnInit(): void 
  {

    this.arr_data = this.data!.data25pts; 
    this.datavend = this.data!.datav;
    this.fechainicial = this.data!.fechaini;
    this.fechafinal = this.data!.fechafin; 
   
    let series:any[] = []; 

    for(let i =1;i<=8;i++)
      {
        series = []; 
          for(let item of this.datavend)
            {
              let regv = this.arr_data.filter(x => x.numsemana == i && x.vendedor == item.vendedor); 
              series.push({name:item.vendedor,value:regv.length});
            }
        this.datagS.push({name:"SEMANA "+this.data!.numsemanau[i-1],series:series});

      }

      for(let item of this.datavend)
        {

           let regv1 = this.arr_data.filter(x => x.numsemana == 1 && x.vendedor == item.vendedor).length;
           let regv2 = this.arr_data.filter(x => x.numsemana == 2 && x.vendedor == item.vendedor).length; 
           let regv3 = this.arr_data.filter(x => x.numsemana == 3 && x.vendedor == item.vendedor).length; 
           let regv4 = this.arr_data.filter(x => x.numsemana == 4 && x.vendedor == item.vendedor).length; 
           let regv5 = this.arr_data.filter(x => x.numsemana == 5 && x.vendedor == item.vendedor).length; 
           let regv6 = this.arr_data.filter(x => x.numsemana == 6 && x.vendedor == item.vendedor).length; 
           let regv7 = this.arr_data.filter(x => x.numsemana == 7 && x.vendedor == item.vendedor).length; 
           let regv8 = this.arr_data.filter(x => x.numsemana == 8 && x.vendedor == item.vendedor).length;

           let totali:number= regv1+regv2+regv3+regv4+regv5+regv6+regv7+regv8; 
            let prop = item.venta * 0.05; 
              this.dataT.push({name:item.vendedor,s1:regv1,s2:regv2,s3:regv3,s4:regv4,s5:regv5,s6:regv6,s7:regv7,s8:regv8,total:totali,totalv:item.venta,propina: prop,aycsc: item.aycsc});
        }  

        let s1 = this.dataT.reduce((acumulador:number, elemento) => {
              return acumulador + parseFloat(elemento.s1.toString());
          }, 0);
        
          let s2 = this.dataT.reduce((acumulador:number, elemento) => {
            return acumulador + parseFloat(elemento.s2.toString());
        }, 0);

                  let s3 = this.dataT.reduce((acumulador:number, elemento) => {
                    return acumulador + parseFloat(elemento.s3.toString());
                }, 0);

                let s4 = this.dataT.reduce((acumulador:number, elemento) => {
                  return acumulador + parseFloat(elemento.s4.toString());
              }, 0);

              let s5 = this.dataT.reduce((acumulador:number, elemento) => {
                return acumulador + parseFloat(elemento.s5.toString());
            }, 0);

            let s6 = this.dataT.reduce((acumulador:number, elemento) => {
              return acumulador + parseFloat(elemento.s6.toString());
          }, 0);

          let s7 = this.dataT.reduce((acumulador:number, elemento) => {
            return acumulador + parseFloat(elemento.s7.toString());
        }, 0);

        let s8 = this.dataT.reduce((acumulador:number, elemento) => {
          return acumulador + parseFloat(elemento.s8.toString());
        }, 0);

        let totali = s1+s2+s3+s4+s5+s6+s7+s8;

        let totalv = this.dataT.reduce((acumulador:number, elemento) => {
          return acumulador + parseFloat(elemento.totalv.toString());
        }, 0);

        let prop = this.dataT.reduce((acumulador:number, elemento) => {
          return acumulador + parseFloat(elemento.propina.toString());
        }, 0);

        let totaycsc = this.dataT.reduce((acumulador:number, elemento) => {
          return acumulador + parseInt(elemento.aycsc.toString());
        }, 0);

        this.itemt.push({name:'TOTAL',s1:s1,s2:s2,s3:s3,s4:s4,s5:s5,s6:s6,s7:s7,s8:s8,total:totali,totalv:totalv,propina: prop, aycsc : totaycsc});
    
         this.datamermas = this.data!.datamermas; 
        let datacomprasm:CompraArt[] = this.data!.comprasdata;

        let seriesdgm:any[] = []; 

        for(let item of datacomprasm)
          {
            let datamo = this.datamermas.filter(x => x.semana == item.semana && x.tipo == 'MO');
            let datamp = this.datamermas.filter(x => x.semana == item.semana && x.tipo == 'MP');
            
            let porcentajemao = (datamo[0].mermaAla/item.cAla)*100; 
            let porcentajemap = (datamp[0].mermaAla/item.cAla)*100; 

            let porcentajembo = (datamo[0].mermaBoneless/item.cBoneless)*100; 
            let porcentajembp = (datamp[0].mermaBoneless/item.cBoneless)*100; 

            seriesdgm = [];
            
            seriesdgm.push({name:"MERMA OPERATIVA",value:porcentajemao});
            seriesdgm.push({name:"MERMA PROVEEDOR",value:porcentajemap});
            
            this.datagmermasA.push({name:item.lblsemana, series:seriesdgm});
            seriesdgm = [];

             seriesdgm.push({name:"MERMA OPERATIVA",value:porcentajembo});
            seriesdgm.push({name:"MERMA PROVEEDOR",value:porcentajembp});
            this.datagmermasB.push({name:item.lblsemana, series:seriesdgm});
          }

      this.datamermalisto = true; 
      this.diferenciaslisto = true; 

   }

   formatDataLabel(value: any, label: string, series: any) {
    let lbl = parseFloat(parseFloat(value).toFixed(2));
    return `${lbl}%`;
  }

  getcolorg(index:number):any
{
  while(index>19)
    {
      index = index-19; 
    }

    let domain:string[] = [this.colorScheme.domain[index]]; 

    return  {domain:domain}
}

getdataGv(vendedor:string):any[]
{
  let datag:any[] = []; 
  let temp = this.dataT.filter(x => x.name == vendedor);
  let datav = temp[0]; 

  datag.push({name:"W "+this.data!.numsemanau[0],value:datav.s1});
  datag.push({name:"W "+this.data!.numsemanau[1],value:datav.s2});
  datag.push({name:"W "+this.data!.numsemanau[2],value:datav.s3});
  datag.push({name:"W "+this.data!.numsemanau[3],value:datav.s4});
  datag.push({name:"W "+this.data!.numsemanau[4],value:datav.s5});
  datag.push({name:"W "+this.data!.numsemanau[5],value:datav.s6});
  datag.push({name:"W "+this.data!.numsemanau[6],value:datav.s7});
  datag.push({name:"W "+this.data!.numsemanau[7],value:datav.s8});
  return datag; 
}



}
