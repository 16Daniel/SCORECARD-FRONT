import { Component, Input, type OnInit } from '@angular/core';
import { MermasOperativasRegional, MermasOperativasRegionalGeneral } from '../../../../Interfaces/25Pts';
import { PmermasModel } from '../../../../Interfaces/BonoData';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ev-mermas-operativas',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './evMermasOperativas.component.html',
})
export class EvMermasOperativasComponent implements OnInit {
@Input() data:MermasOperativasRegionalGeneral | undefined;
public arr_data:MermasOperativasRegional[] = []; 
public dataTableAla:any[] = [];
public dataTableBoneless:any[] = [];
public dataTablePapa:any[] = [];
public sucursalesdistintas:number[] = [];
  ngOnInit(): void 
  {
    this.arr_data = this.data!.data; 
    this.sucursalesdistintas = [...new Set(this.arr_data.map(sucursal => sucursal.idf))];
    for(let item of this.sucursalesdistintas)
      {
        let datas1 = this.arr_data.filter(x=> x.idf == item);
        this.dataTableAla.push({
          nombresuc:datas1[0].nombresuc,
          s1: this.getdatacellAla(item,this.data!.semanas[0]),
          s2: this.getdatacellAla(item,this.data!.semanas[1]),
          s3: this.getdatacellAla(item,this.data!.semanas[2]),
          s4: this.getdatacellAla(item,this.data!.semanas[3]),
          s5: this.getdatacellAla(item,this.data!.semanas[4]),
          s6: this.getdatacellAla(item,this.data!.semanas[5]),
          s7: this.getdatacellAla(item,this.data!.semanas[6]),
          s8: this.getdatacellAla(item,this.data!.semanas[7]),
        });

        this.dataTableBoneless.push({
          nombresuc:datas1[0].nombresuc,
          s1: this.getdatacellBoneless(item,this.data!.semanas[0]),
          s2: this.getdatacellBoneless(item,this.data!.semanas[1]),
          s3: this.getdatacellBoneless(item,this.data!.semanas[2]),
          s4: this.getdatacellBoneless(item,this.data!.semanas[3]),
          s5: this.getdatacellBoneless(item,this.data!.semanas[4]),
          s6: this.getdatacellBoneless(item,this.data!.semanas[5]),
          s7: this.getdatacellBoneless(item,this.data!.semanas[6]),
          s8: this.getdatacellBoneless(item,this.data!.semanas[7]),
        });

        this.dataTablePapa.push({
          nombresuc:datas1[0].nombresuc,
          s1: this.getdatacellPapa(item,this.data!.semanas[0]),
          s2: this.getdatacellPapa(item,this.data!.semanas[1]),
          s3: this.getdatacellPapa(item,this.data!.semanas[2]),
          s4: this.getdatacellPapa(item,this.data!.semanas[3]),
          s5: this.getdatacellPapa(item,this.data!.semanas[4]),
          s6: this.getdatacellPapa(item,this.data!.semanas[5]),
          s7: this.getdatacellPapa(item,this.data!.semanas[6]),
          s8: this.getdatacellPapa(item,this.data!.semanas[7]),
        });
      }
   }

   getdatacellAla(ids:number,numsemana:number):number
   {
    let porcentaje = 0; 
      let data = this.arr_data.filter(x=>x.idf == ids && x.numsemana == numsemana);
      if(data.length>0)
        {
          porcentaje = data[0].pmAla; 
        } 

        return porcentaje
   }

   getdatacellBoneless(ids:number,numsemana:number):number
   {
    let porcentaje = 0; 
      let data = this.arr_data.filter(x=>x.idf == ids && x.numsemana == numsemana);
      if(data.length>0)
        {
          porcentaje = data[0].pmBoneless; 
        } 

        return porcentaje
   }

   getdatacellPapa(ids:number,numsemana:number):number
   {
    let porcentaje = 0; 
      let data = this.arr_data.filter(x=>x.idf == ids && x.numsemana == numsemana);
      if(data.length>0)
        {
          porcentaje = data[0].pmPapa; 
        } 

        return porcentaje
   }
}
