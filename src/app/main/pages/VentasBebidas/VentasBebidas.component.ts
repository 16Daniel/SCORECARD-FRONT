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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { VentaBebida } from '../../../Interfaces/VentaBebida.';
import { DetallesVentasBebidasComponent } from "./DetallesVentasBebidas/DetallesVentasBebidas.component";
@Component({
  selector: 'app-ventas-bebidas',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    MultiSelectModule,
    FormsModule,
    LoaderComponent,
    NgxChartsModule,
    CalendarModule,
    DetallesVentasBebidasComponent
],
  providers:[MessageService],
  templateUrl: './VentasBebidas.component.html',
})
export default class VentasBebidasComponent implements OnInit {
  public arr_data:VentaBebida[] = []; 
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
    
    customColorsrl = (name:number): string => {
      let Sucursal = this.datag2.filter(x=>x.name == name);
      let porcentaje= Sucursal[0].value;
      let color = '#6D28D9'; 
      if(porcentaje<5)
        {
          color = '#d9003e';
        }
  
      if(porcentaje<8 && porcentaje>=5)
            {
              color = '#ffc500';
            }
  
      if(porcentaje>=8)
        {
          color = '#39df18';
        }
        return color;
    };
    customColorsc = (name:number): string => {
      let Sucursal = this.datag.filter(x=>x.name == name);
      let porcentaje= Sucursal[0].value;
  

      let color = '#6D28D9'; 
      if(porcentaje<20)
        {
          color = '#d9003e';
        }
  
      if(porcentaje<25 && porcentaje>=20)
            {
              color = '#ffc500';
            }
  
      if(porcentaje>=25)
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
    this.datag2 = []; 
    let sucursales:number[] = []; 
    for(let item of this.sucursalesSel)
      {
        sucursales.push(item.cod); 
      }

  this.loading= true;
  this.apiserv.getVentasBebidas(JSON.stringify(sucursales),this.formatDate(this.getPreviousSunday(this.fechaini)),this.formatDate(this.getNextSaturday(this.fechafin))).subscribe({
   next: data => {
      this.arr_data = data; 
      this.loading = false;
      
      for(let item of this.sucursalesSel)
        {

          let cerveza:number = this.arr_data.reduce((acumulador, elemento) => {
            if (elemento.idfront == item.cod) {
              return acumulador + elemento.cerveza;
            } else {
              return acumulador;
            }
          }, 0);

          let rebelitros:number = this.arr_data.reduce((acumulador, elemento) => {
            if (elemento.idfront == item.cod) {
              return acumulador + elemento.rebelitros;
            } else {
              return acumulador;
            }
          }, 0); 


          let salon:number = this.arr_data.reduce((acumulador, elemento) => {
            if (elemento.idfront == item.cod) {
              return acumulador + elemento.salon;
            } else {
              return acumulador;
            }
          }, 0);

          let pcervezas = 0; 
          let prebellitros = 0; 

          if(cerveza>0 && salon>0)
            {
              pcervezas = (cerveza/salon)*100; 
            }
         
            if(rebelitros>0 && salon>0)
              {
                prebellitros = (rebelitros/salon)*100; 
              }

          this.datag.push({name:item.name,value:pcervezas});
          this.datag2.push({name:item.name,value:prebellitros});
        }
        
        this.datag.sort((a, b) => b.value - a.value);
        this.datag2.sort((a, b) => b.value - a.value);

        console.log(this.arr_data);
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

getdataSuc(idsuc:number):VentaBebida[]
{
 let data = this.arr_data.filter(x => x.idfront == idsuc); 
 return data; 
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
      link.download = 'VENTA DE BEBIDAS VS SALON.xlsx'; // Establecer el nombre del archivo
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

changeSucs()
{
  this.arr_data = []; 
}

}
