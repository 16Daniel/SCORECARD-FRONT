import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom, type OnInit } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { FormsModule } from '@angular/forms';
import { Semana } from '../../../Interfaces/Semana.';
import { CalendarModule } from 'primeng/calendar';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { InicioAYC } from '../../../Interfaces/InicioAYC.';
import { SucursalInicioAYCComponent } from '../../../Shared/SucursalInicioAYC/SucursalInicioAYC.component';
@Component({
  selector: 'app-ayc',
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    ToastModule,
    FormsModule,
    CalendarModule,
    LoaderComponent,
    SucursalInicioAYCComponent
],
  providers:[MessageService,ConfirmationService],
  templateUrl: './AYC.component.html',
})
export default class AYCComponent implements OnInit {
public arr_semanas:Semana[] = [{name:'semana 1',value:1}]; 
public semanasSel:Semana[] = []; 
public catsucursales:Sucursal[] = [];
public sucursalesSel:Sucursal[] = [];
public loading:boolean = false; 

public fechaini:Date = new Date(); 
public fechafin:Date = new Date(); 
public arr_inicioayc:InicioAYC[] = []; 

public parametrosjdata:string = "";

  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService,private confirmationService: ConfirmationService)
{
  this.getSucursales(); 
}

  ngOnInit(): void { }
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

formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

consultaYAC()
{

    let sucursales:number[] = []; 
    for(let item of this.sucursalesSel)
      {
        sucursales.push(item.cod); 
      }

  this.loading= true;
  this.apiserv.getIniciosAYC(JSON.stringify(sucursales),this.formatDate(this.getMonday(this.fechaini)),this.formatDate(this.getNextSunday(this.fechafin))).subscribe({
   next: data => {
      this.arr_inicioayc = data; 
      console.log(data); 
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

getDataSuc(idsuc:number):InicioAYC[]
{ let data:InicioAYC[] = this.arr_inicioayc.filter(x=> x.fo == idsuc.toString()); 
  return data; 
}


getparametros()
{
  if(this.sucursalesSel.length==0)
    {
      this.showMessage('info',"Error","Seleccioar una o más sucursales");
      return; 
    }
 
    this.arr_inicioayc = []; 

  this.loading= true;
     this.apiserv.getparametros().subscribe({
      next: data => {
        if(data != null)
          {
            this.parametrosjdata = data.jdata; 
            this.consultaYAC(); 
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


}
