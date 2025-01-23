import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { CalendarModule } from 'primeng/calendar';
import { TiemposSucursalComponent } from './TiemposSucursal/TiemposSucursal.component';
import { TiemposSuc } from '../../../Interfaces/Tiempos.';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-tiempos',
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    ToastModule,
    FormsModule,
    CalendarModule,
    LoaderComponent,
    TiemposSucursalComponent,
    NgxChartsModule
],
  providers:[MessageService],
  templateUrl: './Tiempos.component.html',
})
export default class TiemposComponent implements OnInit {
  public arr_data:TiemposSuc[] = []; 
  public catsucursales:Sucursal[] = [];
  public sucursalesSel:Sucursal[] = [];
  public loading:boolean = false; 
  public loading2:boolean = false; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  public parametrosjdata:string = "";
  public datag:any[] = [];
  public datag2:any[] = []; 
  public rangosemanas:string = ""; 

  showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    legendPosition: string = 'below';
    showXAxisLabel: boolean = true;
    yAxisLabel: string = 'SEMANA';
    showYAxisLabel: boolean = true;
    xAxisLabel = '';
  
    colorScheme:any = {
      domain: [
        "#00FF00", // Verde fuerte
        "#FFFF00", // Amarillo
        "#FF0000",  // Rojo
        "#4e1eff", // Morado
      ]
    };
    
    colorestiempos:any;

    constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
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


  consultarTiempos()
{
    this.arr_data = []; 
    this.datag = [];
    this.datag2 = []; 
    let sucursales:number[] = []; 
    for(let item of this.sucursalesSel)
      {
        sucursales.push(item.cod); 
      }

  this.loading= true;
  this.apiserv.getTiempos(JSON.stringify(sucursales),this.formatDate(this.getPreviousSunday(this.fechaini)),this.formatDate(this.getNextSaturday(this.fechafin)),this.formatDate(this.fechaini),this.formatDate(this.fechafin)).subscribe({
   next: data => {
      this.arr_data = data; 
       
      let domaintiempos:string[] = [];
      for(let item of this.arr_data)
        {
              let rsinconexion = item.rangos.reduce((acumulador, elemento) => {
                if (elemento.rango == 'SIN CONEXION') {
                  return acumulador + elemento.total;
                } else {
                  return acumulador;
                }
              }, 0);
    
              let r1 = item.rangos.reduce((acumulador, elemento) => {
              if (elemento.rango == '0-10') {
                return acumulador + elemento.total;
              } else {
                return acumulador;
              }
            }, 0);
          
            let r2 = item.rangos.reduce((acumulador, elemento) => {
              if (elemento.rango == '11-15') {
                return acumulador + elemento.total;
              } else {
                return acumulador;
              }
            }, 0);
    
            let r3 = item.rangos.reduce((acumulador, elemento) => {
              if (elemento.rango == '16-20') {
                return acumulador + elemento.total;
              } else {
                return acumulador;
              }
            }, 0);
    
            let r4 = item.rangos.reduce((acumulador, elemento) => {
              if (elemento.rango == '21-25') {
                return acumulador + elemento.total;
              } else {
                return acumulador;
              }
            }, 0);
    
            let r5 = item.rangos.reduce((acumulador, elemento) => {
              if (elemento.rango == '26-30') {
                return acumulador + elemento.total;
              } else {
                return acumulador;
              }
            }, 0);

            let total = rsinconexion+r1+r2+r3+r4+r5; 

            let psc = (rsinconexion/total)*100;
            let pr1 = (r1/total)*100; 
            let pr2 = (r2/total)*100; 
            let pr3 = (r3/total)*100; 
            let pr4 = (r4/total)*100; 
            let pr5 = (r5/total)*100; 
          
            let series:any[] = [];

            series.push({name:"0-10",value:pr1}); 
            series.push({name:"11-15",value:pr2}); 
            series.push({name:"16-30",value:pr3+pr4+pr5}); 
            series.push({name:"SIN CONEXION",value:psc}); 
            
            this.datag.push({name:item.sucursal,series:series});
            this.datag2.push({name:item.sucursal,value:item.promedio});
        }

        
        this.datag.sort((a, b) => b.series[0].value - a.series[0].value);
        this.datag2.sort((a, b) => a.value - b.value); 

        let semanasordenadas = this.arr_data[0].rangos.sort((a,b)=> a.semana - b.semana); 

        if(semanasordenadas.length>1)
          {
            this.rangosemanas = semanasordenadas[0].semana+" - " + semanasordenadas[semanasordenadas.length-1].semana; 
          } else 
          {
            this.rangosemanas = semanasordenadas[0].semana.toString(); 
          }
        

        for(let item of this.datag2)
          {
            if(item.value<=7)
              {
                domaintiempos.push("#00FF00"); 
              }
              if(item.value>7 && item.value<=12)
                {
                  domaintiempos.push("#FFFF00"); 
                }
                if(item.value>12)
                  {
                    domaintiempos.push("#FF0000"); 
                  }
          }

          this.colorestiempos = {domain:domaintiempos}; 

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

getDataSuc(nombre:string):TiemposSuc
{
  let data = this.arr_data.filter(x => x.sucursal==nombre);
  return data[0]; 
}

formatDataLabel(value: any, label: string, series: any) {
  value = Math.round(value); 
  return `${value}%`;
}

exportarExcel()
{ 
  this.loading2 = true;
  this.apiserv.ExcelTiemposPromedios(JSON.stringify(this.datag2),this.formatDate(this.fechaini),this.formatDate(this.fechafin)).subscribe({
    next: data => {
      this.loading2 = false;
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
      link.download = 'TIEMPOS PROMEDIO.xlsx'; // Establecer el nombre del archivo
      document.body.appendChild(link);
  
      // Hacer clic en el enlace para iniciar la descarga
      link.click();
  
      // Limpiar la URL y el enlace después de la descarga
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    error: error => {
      this.loading2 = false; 
      this.showMessage('error','Error','Error al generar el archivo de excel');
      console.log(error);
     
    }
});
}



}
