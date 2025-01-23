import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MessageService } from 'primeng/api';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Diferencia } from '../../../Interfaces/Diferencia';
import { TableModule } from 'primeng/table';
import { DiferenciasSucComponent } from "./DiferenciasSuc/DiferenciasSuc.component";

@Component({
  selector: 'app-diferencias',
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    ToastModule,
    FormsModule,
    CalendarModule,
    LoaderComponent,
    NgxChartsModule,
    TableModule,
    DiferenciasSucComponent
],
  providers:[MessageService],
  templateUrl: './Diferencias.component.html',
})
export default class DiferenciasComponent implements OnInit {
  public arr_data:Diferencia[] = []; 
  public catsucursales:Sucursal[] = [];
  public sucursalesSel:Sucursal[] = [];
  public loading:boolean = false; 
  public loading2:boolean = false; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  public fmermas:string ='';
  public finventario:string=''; 
  public itemsel:Diferencia | undefined; 

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
      domain: ['#00ffb2']
    };
    public datag:any[] = [];
    public dataga:any[] = [];
    public datagb:any[] = [];
    public datagp:any[] = [];
  

  ngOnInit(): void { }


  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
  {
    this.getSucursales(); 
  }
  
  
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det }); 
}

getdata()
{
  let sucursales:number[] = []; 
    for(let item of this.sucursalesSel)
      {
        sucursales.push(item.cod); 
      }
  this.loading= true;
     this.apiserv.getDiferencias(JSON.stringify(sucursales),this.formatDate(this.fechaini),this.formatDate(this.fechafin)).subscribe({
      next: data => {
         this.arr_data = data; 
         this.loading = false;

                    const semanas = this.arr_data.map(item => item.semana);
                const semanasUnicas:number[] = Array.from(new Set(semanas));

                for(let suc of this.sucursalesSel)
                  {
                    let datas = this.arr_data.filter(x => x.idsuc == suc.cod); 

                    let series:any[] = []; 

                    let t_d_a = datas.reduce((acumulador:number, elemento) => {
                      if(elemento.codart == 158)
                        {
                          return acumulador + parseFloat(elemento.diferencia.toString());
                        } else 
                        {
                          return acumulador; 
                        }
                  }, 0);

                  let t_d_b = datas.reduce((acumulador:number, elemento) => {
                    if(elemento.codart == 10183)
                      {
                        return acumulador + parseFloat(elemento.diferencia.toString());
                      } else 
                      {
                        return acumulador; 
                      }
                }, 0);

                let t_d_p = datas.reduce((acumulador:number, elemento) => {
                  if(elemento.codart == 10193)
                    {
                      return acumulador + parseFloat(elemento.diferencia.toString());
                    } else 
                    {
                      return acumulador; 
                    }
              }, 0);
              
              this.dataga.push({name:suc.name,value:t_d_a});
              this.datagb.push({name:suc.name,value:t_d_b});
              this.datagp.push({name:suc.name,value:t_d_p});
          
                }
              
         console.log(data);
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.loading = false;
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
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
  

  limpiardata()
  {
    this.arr_data = []; 
  }
  
editarlinea(item:Diferencia)
{
  this.itemsel = item; 
}

getDataSuc(ids:number):Diferencia[]
{
  let data = this.arr_data.filter(x=> x.idsuc == ids); 
  return data; 
}

}
