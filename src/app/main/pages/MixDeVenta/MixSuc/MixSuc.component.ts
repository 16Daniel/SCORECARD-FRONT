import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MixVenta } from '../../../../Interfaces/Venta';
@Component({
  selector: 'app-mix-suc',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './MixSuc.component.html',
})
export class MixSucComponent implements OnInit {
  @Input() data:MixVenta[] = [];

    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    yAxisLabel: string = 'SEMANA';
    showYAxisLabel: boolean = true;
    xAxisLabel: string = '';
    colorScheme:any = {
      domain: ['#00f7ff', '#ff00f7 ', '#a8385d', '#aae3f5']
    };
    public datags:any[] = [];
    public datagd:any[] = [];
    public datagp:any[] = [];

  ngOnInit(): void
  {

    const semanas = this.data.map(item => item.semana);
    const semanasUnicas:number[] = Array.from(new Set(semanas));

    for(let semana of semanasUnicas)
      {
        let datas = this.data.filter(x => x.semana == semana); 

        let series:any[] = []; 
        series.push({name:"Alimentos",value:datas[0].alimentosSalon}); 
        series.push({name:"Bebidas",value:datas[0].bebidasSalon});
        this.datags.push({name:""+semana,series:series}); 

        series = [];
        series.push({name:"Alimentos",value:datas[0].alimentosDelivery}); 
        series.push({name:"Bebidas",value:datas[0].bebidasDelivery});
        this.datagd.push({name:""+semana,series:series}); 

        series = []; 
        series.push({name:"Alimentos",value:datas[0].alimentosPickup}); 
        series.push({name:"Bebidas",value:datas[0].bebidasPickup});
        this.datagp.push({name:""+semana,series:series}); 
      }


   }

}
