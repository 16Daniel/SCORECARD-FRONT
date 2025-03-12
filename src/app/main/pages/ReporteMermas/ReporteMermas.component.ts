import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { CalendarModule } from 'primeng/calendar';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CompraArt, MermasDS } from '../../../Interfaces/Merma';
@Component({
  selector: 'app-reporte-mermas',
  standalone: true,
   imports: [
      CommonModule,
      MultiSelectModule,
      ToastModule,
      FormsModule,
      CalendarModule,
      LoaderComponent,
      NgxChartsModule,
      DropdownModule,
      RouterModule
  ],
    providers:[MessageService],
  templateUrl: './ReporteMermas.component.html',
})
export default class ReporteMermasComponent implements OnInit {
  public window: any;
  public catsucursales:Sucursal[] = [];
  public sucursalSel:Sucursal|undefined;
  public loading:boolean = false; 
  public loading2:boolean = false; 
  public datagmermasA:any[] = [];
  public datagmermasB:any[] = []; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  public numsemanau:number[] = []; 

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

  colorSchemeGM:any = {
    domain: [
      "#8A2BE2", // Azul neón
      "#FF1493", // Rosa neón

    ]
  };


  datamermas:MermasDS[]  = []; 
  
  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService,private router: Router)
  {
    this.getSucursales(); 
  }
  
  ngOnInit(): void 
  {

  }
  
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det }); 
}

getSucursales()
{
  this.loading= true;
   this.apiserv.getSucursales().subscribe({
    next: data => {
       this.catsucursales=data;
       this.loading = false;
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}


consultarMermas()
{

    let sucursales:number[] = []; 
    sucursales.push(this.sucursalSel!.cod); 

  this.loading= true;
  this.apiserv.getMermas(JSON.stringify(sucursales),this.formatDate(this.fechafin)).subscribe({
   next: data => {
  
      this.datamermas = data.mermasdata; 
      this.numsemanau = data.numsemanau;
       
            let datacomprasm:CompraArt[] = data.comprasdata;
    
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
    
              this.datagmermasA.reverse(); 
              this.datagmermasB.reverse(); 



      this.loading = false;
      this.cdr.detectChanges();
   },
   error: error => {
      console.log(error);
      this.loading = false;
      this.showMessage('error',"Error","Error al procesar la solicitud");
   }
});

}


  getPreviousSunday(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0 es domingo
    const diff = dayOfWeek === 0 ? 0 : dayOfWeek; // Si es domingo, no retrocede
    const previousSunday = new Date(date);
    previousSunday.setDate(date.getDate() - diff); // Restar los días necesarios para llegar al domingo
    return previousSunday;
  }
  
  getNextSaturday(date: Date): Date {
    const dayOfWeek = date.getDay(); // 6 es sábado
    const diff = dayOfWeek === 6 ? 0 : 6 - dayOfWeek; // Si es sábado, no avanza
    const nextSaturday = new Date(date);
    nextSaturday.setDate(date.getDate() + diff); // Sumar los días necesarios para llegar al sábado
    return nextSaturday;
  }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }


  changesuc()
  {
    this.datamermas = []; 
  }

  formatDataLabel(value: any, label: string, series: any) {
    let lbl = parseFloat(parseFloat(value).toFixed(2));
    return `${lbl}%`;
  }

}
