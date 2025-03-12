import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { MessageService } from 'primeng/api';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { CalendarModule } from 'primeng/calendar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DropdownModule } from 'primeng/dropdown';
import { DetallesPorcentajeBebidasComponent } from "./DetallesPorcentajeBebidas/DetallesPorcentajeBebidas.component";
@Component({
  selector: 'app-porcentaje-bebidas',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    MultiSelectModule,
    FormsModule,
    LoaderComponent,
    NgxChartsModule,
    CalendarModule,
    DropdownModule,
    DetallesPorcentajeBebidasComponent
],
  providers:[MessageService],
  templateUrl: './PorcentajeBebidas.component.html',
})
export default class PorcentajeBebidasComponent implements OnInit {
  public arr_data:any[] = []; 
  public catsucursales:Sucursal[] = [];
  public sucursalesSel:Sucursal[] = [];
  public loading:boolean = false; 
  public loading2:boolean = false; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  public parametrosjdata:string = "";
  public datag:any[] = [];
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
    
    customColorsc = (name:number): string => {
      let Sucursal = this.datag.filter(x=>x.name == name);
      let porcentaje= Sucursal[0].value;
  

      let color = '#6D28D9'; 
      if(porcentaje<40)
        {
          color = '#d9003e';
        }
  
      if(porcentaje>=40)
        {
          color = '#39df18';
        }
        return color;
    };

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
  
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }


  consultarVentasBebidas()
{
    this.arr_data = []; 
    this.datag = [];
  this.loading= true;
  let sucursales:number[] = []; 
    for(let item of this.sucursalesSel)
      {
        sucursales.push(item.cod); 
      }

  this.apiserv.getPBebidas(JSON.stringify(sucursales),this.formatDate(this.getMonday(this.fechaini)),this.formatDate(this.getNextSunday(this.fechafin))).subscribe({
   next: data => {
      this.arr_data = data; 
      console.log(data); 
      this.loading = false;
      
      for(let item of this.arr_data)
        {
          let porcentaje = 0; 
          if(item.alimentos >0)
            {
              porcentaje = (item.bebidas/item.alimentos)*100;
            }
          this.datag.push({name:"W"+item.semana,value:porcentaje}); 

        }

      this.cdr.detectChanges();
   },
   error: error => {
      console.log(error);
      this.loading = false;
      this.showMessage('error',"Error","Error al procesar la solicitud");
   }
});

}

formatDataLabel(value: number, label: string, series: any) {
 // value = Math.round(value); 
  return `${value.toFixed(2)}%`;
}

getMonday(date: Date): Date {
  const day = date.getDay(); // Obtiene el día de la semana (0 es Domingo, 1 es Lunes, etc.)
  const diff = (day === 0 ? -6 : 1) - day; // Calcula la diferencia en días para llegar al lunes
  const monday = new Date(date); // Crea una copia de la fecha
  monday.setDate(date.getDate() + diff); // Ajusta la fecha para que sea lunes
  return monday; // Devuelve el lunes de la semana
}

getNextSunday(date: Date): Date {
  const day = date.getDay(); // Obtiene el día de la semana (0 es Domingo, 1 es Lunes, etc.)
  const diff = day === 0 ? 0 : 7 - day; // Calcula la diferencia en días para llegar al próximo domingo
  const nextSunday = new Date(date); // Crea una copia de la fecha
  nextSunday.setDate(date.getDate() + diff); // Ajusta la fecha para que sea domingo
  return nextSunday; // Devuelve el próximo domingo
}


changeSuc()
{
  this.arr_data = []; 
  this.datag = []; 
}

getdataSuc(ids:number):any[]
   {
      return this.arr_data.filter(x=>x.idfront == ids); 
   }

   exportarExcel()
   { 
     this.loading2 = true;
     this.apiserv.ExcelVentasBebidas(JSON.stringify(this.arr_data)).subscribe({
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
         link.download = 'PORCENTAJE DE BEBIDAS.xlsx'; // Establecer el nombre del archivo
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
