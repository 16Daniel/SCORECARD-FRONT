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
import { It25pts } from '../../../Interfaces/25Pts';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CompraArt, MermasDS } from '../../../Interfaces/Merma';
import { Dashboardsuc } from '../../../Interfaces/Dashboardsuc';
import { DashSucComponent } from './DashSuc/DashSuc.component';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-it25pts',
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
    RouterModule,
    DashSucComponent
],
  providers:[MessageService],
  templateUrl: './It25pts.component.html',
})
export default class It25ptsComponent implements OnInit {
  public window: any;
  public catsucursales:Sucursal[] = [];
  public sucursalesSel:Sucursal[] = [];
  public loading:boolean = false; 
  public loading2:boolean = false; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  datadash:Dashboardsuc[] = []; 
  
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


consultar25pts()
{

    let sucursales:number[] = []; 
   for(let item of this.sucursalesSel)
    {
      sucursales.push(item.cod); 
    }

  this.loading= true;
  this.apiserv.getDataDashSuc(JSON.stringify(sucursales),this.formatDate(this.getPreviousSunday(this.fechaini)),this.formatDate(this.fechafin)).subscribe({
   next: data => {
  
    console.log(data); 
      this.datadash = data; 
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



descargarpdf()
{
  this.loading = true;

  this.apiserv.getPdfSuc().subscribe({
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
      const blob = new Blob([bytes], { type: 'application/pdf'});
  
      // Crear una URL para el Blob
      const url = window.URL.createObjectURL(blob);
  
      // Crear un enlace para la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DASHBOARD SUPERVISORES.pdf'; // Establecer el nombre del archivo
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

ajustar()
{
  let contenedor = document.getElementById("pdfcont"); 
  contenedor!.style.width = "21.59cm";

  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent); // Disparar el evento en la ventana
}

irAPreview() {
  const texto = document.getElementById("pdfcont")!.innerHTML; // El texto que deseas enviar
  this.router.navigate(['/pdfpreview', texto]);
 
}

changesuc()
{
  this.datadash = []; 
}

getdatasuc(idsuc:number):Dashboardsuc
{
  let data:Dashboardsuc[] = this.datadash.filter(x => x.ids == idsuc);
  return data[0]
}

}
