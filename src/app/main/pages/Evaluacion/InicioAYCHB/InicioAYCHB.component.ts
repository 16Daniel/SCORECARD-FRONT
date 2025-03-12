import { Component, Input, type OnInit } from '@angular/core';
import { generaldata25ptssuc } from '../../../../Interfaces/25Pts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-aychb',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './InicioAYCHB.component.html',
})
export class InicioAYCHBComponent implements OnInit {
@Input() data:generaldata25ptssuc | undefined;
public arr_data:any[] = []; 
public dataTable:any[] = [];
public sucursalesdistintas:number[] = [];
  ngOnInit(): void 
  {
    this.arr_data = this.data!.data; 
    this.sucursalesdistintas = [...new Set(this.arr_data.map(sucursal => sucursal.idf))];
    for(let item of this.sucursalesdistintas)
      {
        let datas1 = this.arr_data.filter(x=> x.idf == item);
        this.dataTable.push({
          nombresuc:datas1[0].nombresuc,
          s1: this.getdatacell(item,this.data!.semanas[0]),
          s2: this.getdatacell(item,this.data!.semanas[1]),
          s3: this.getdatacell(item,this.data!.semanas[2]),
          s4: this.getdatacell(item,this.data!.semanas[3]),
          s5: this.getdatacell(item,this.data!.semanas[4]),
          s6: this.getdatacell(item,this.data!.semanas[5]),
          s7: this.getdatacell(item,this.data!.semanas[6]),
          s8: this.getdatacell(item,this.data!.semanas[7]),
        });
      }
   }

   getdatacell(ids:number,numsemana:number):number
   {
    debugger
    let porcentaje = 0; 
      let data = this.arr_data.filter(x=>x.idf == ids && x.numsemana == numsemana);
      if(data.length>0)
        {
          porcentaje = (data[0].incioshb/data[0].totalayc) * 100;
        } 

        return porcentaje
   }
}