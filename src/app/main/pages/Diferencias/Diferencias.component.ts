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
import { Agrupador } from '../../../Interfaces/Agrupador';
import { DropdownModule } from 'primeng/dropdown';

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
    DiferenciasSucComponent,
     DropdownModule,
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

  public promedioAla:number = 0; 
  public promedioBoneless:number = 0; 
  public promedioPapa:number = 0; 
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

      public groupSel:Agrupador|undefined; 
      public agrupadores:Agrupador[] = [];

  ngOnInit(): void { }


  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
  {
    this.getSucursales(); 
  }
  
  
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det }); 
}

getAgrupadores()
{
  this.loading= true;
  this.apiserv.getAgrupadores().subscribe({
   next: data => {
      this.agrupadores=data;
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
              
                let t_d_a = this.arr_data.reduce((acumulador:number, elemento) => {
                  if(elemento.codart == 158)
                    {
                      return acumulador + parseFloat(elemento.diferencia.toString());
                    } else 
                    {
                      return acumulador; 
                    }
              }, 0);

              let t_d_b = this.arr_data.reduce((acumulador:number, elemento) => {
                if(elemento.codart == 10183)
                  {
                    return acumulador + parseFloat(elemento.diferencia.toString());
                  } else 
                  {
                    return acumulador; 
                  }
            }, 0);

            let t_d_p = this.arr_data.reduce((acumulador:number, elemento) => {
              if(elemento.codart == 10193)
                {
                  return acumulador + parseFloat(elemento.diferencia.toString());
                } else 
                {
                  return acumulador; 
                }
          }, 0);

          this.promedioAla = t_d_a/this.sucursalesSel.length;
          this.promedioBoneless = t_d_b/this.sucursalesSel.length; 
          this.promedioPapa = t_d_p/this.sucursalesSel.length; 

          this.dataga.push({name:'PROMEDIO DEL GRUPO',value:t_d_a/this.sucursalesSel.length});
          this.datagb.push({name:'PROMEDIO DEL GRUPO',value:t_d_b/this.sucursalesSel.length});
          this.datagp.push({name:'PROMEDIO DEL GRUPO',value:t_d_p/this.sucursalesSel.length});
      

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
         this.getAgrupadores();
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


  // Función para exportar a Excel
  exportToExcel() {

    this.loading = true;
    this.apiserv.ExcelDiferencias(JSON.stringify(this.arr_data),this.formatDate(this.fechafin)).subscribe({
      next: data => {
        this.loading = false;
        this.cdr.detectChanges();
        const base64String = data.base64File; // Aquí debes colocar tu cadena base64 del archivo Excel
  
        // Decodificar la cadena base64
        const binaryString = window.atob(base64String);
    
        // Convertir a un array de bytes
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
    
        // Crear un Blob con los datos binarios
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
        // Crear una URL para el Blob
        const url = window.URL.createObjectURL(blob);
    
        // Crear un enlace para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = 'REPORTE DIFERENCIAS.xlsx'; // Establecer el nombre del archivo
        document.body.appendChild(link);
    
        // Hacer clic en el enlace para iniciar la descarga
        link.click();
    
        // Limpiar la URL y el enlace después de la descarga
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      },
      error: error => {
        this.loading = false; 
        this.showMessage('error','Error','Error al generar el archivo de excel');
        console.log(error);
       
      }
  });

}


customColors():any {
  let colores:string[] = [];

  for(let item of this.dataga)
    {
      let color = '#00ffb2';
      if(item.name == 'PROMEDIO DEL GRUPO')
        {
          color = '#bebebe'; 
        }
      colores.push(color);
    }

    return {
      domain:colores
    }
}

changeSuc()
{
  this.arr_data = []; 
}

changeGroup()
{  

   if(this.groupSel != undefined)
     {
       this.sucursalesSel = []; 
       let obj = JSON.parse(this.groupSel.jdata); 

       for(let item of obj)
         {
           let suc = this.catsucursales.filter(x=>x.cod == item); 
           if(suc.length>0){ this.sucursalesSel.push(suc[0]); }
         }
         
     }
}


}
