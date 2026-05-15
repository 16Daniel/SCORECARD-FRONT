import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../Services/api.service';
import { TableModule } from 'primeng/table';
import { DataModelReporteVentasRespuesta, VentaFecha } from '../../../Interfaces/Venta';
import { LoaderComponent } from "../../../Shared/Loader/Loader.component";
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { ComparativaVentas } from "../../../components/comparativa-ventas/comparativa-ventas";
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-tablero-ventas',
  standalone: true,
  imports: [CommonModule, CalendarModule, FormsModule, MultiSelectModule, TableModule, LoaderComponent, SelectButtonModule, TabViewModule, ComparativaVentas,ToastModule],
  providers:[MessageService],
  templateUrl: './tablero_ventas.html',
  styleUrl: './tablero_ventas.scss',
})
export default class TableroVentas implements OnInit {
public fechaini1:Date = new Date(); 
public fechafin1:Date = new Date(); 
public fechaini2:Date = new Date(); 
public fechafin2:Date = new Date(); 
public catsucursales:Sucursal[] = [];
public sucursalesSel:Sucursal[] = [];
public loading:boolean = false; 
public datasucursales:DataModelReporteVentasRespuesta[] = []; 
public diasSemana:string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
public dataTabla1:any[] = []; 
public dataTabla2:any[] = []; 
public columnas:string[] = []; 
public stateOptions: any[] = [];
public valueopcion: number = 0;
public tabladetalles:any[] = []; 
constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
  {
    this.getSucursales(); 
  }
  

ngOnInit(): void { this.getSucursales(); }
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det }); 
}

changeSuc()
{
 
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

consultar()
{
  if(this.areRangesEqualDays(this.fechaini1,this.fechafin1,this.fechaini2,this.fechafin2))
    {

    }else
      {
         this.showMessage('info',"Error","los 2 rangos de fechas deben tener el mismo numero de días");
        return
      }
  this.loading= true;

  let data = 
  {
    fechaini1:this.fechaini1,
    fechafin1:this.fechafin1,
    fechaini2:this.fechaini2,
    fechafin2:this.fechafin2,
    sucursales: JSON.stringify(this.sucursalesSel)
  };
    this.dataTabla1 = [];
    this.dataTabla2 = []; 
     this.apiserv.getDataTableroVentas(data).subscribe({
      next: data => {
         this.datasucursales = data; 
          console.log(data); 
          this.columnas = ['DIA','FECHA']; 
          for(let item of this.sucursalesSel)
            {
              this.columnas.push(item.name); 
            }
 
        let fechai1:Date = new Date(this.fechaini1.toDateString()); 
        while(fechai1.getTime()<= this.fechafin1.getTime())
          { 
            let row:any[] =[]; 
            let nombredia = this.diasSemana[fechai1.getDay()]; 
            fechai1.setHours(0,0,0,0);
            row[0] = nombredia; 
            let dia = fechai1.getDate()>9 ? fechai1.getDate(): '0'+fechai1.getDate(); 
            let mes = (fechai1.getMonth()+1)>9 ? (fechai1.getMonth()+1): '0'+(fechai1.getMonth()+1); 
            row[1] = dia+"/"+mes+"/"+fechai1.getFullYear(); 
            let index = 2;  
            for(let suc of this.sucursalesSel)
              {
                let datasuc = this.datasucursales.filter(x=> x.idSucursal == suc.cod); 
                 let dataventas = datasuc[0].ventaFechas.filter(x => {
                    // Si x.fecha no existe, lo ignoramos
                    if (!x.fecha) return false;

                    const [year, month, day] = x.fecha.toString().split("T")[0].split("-").map(Number);
                    // Convertir a Date (asumiendo que es string o timestamp)
                    let fechaObj = new Date(year, month - 1, day);
                    // Verificar que la conversión sea válida
                    if (isNaN(fechaObj.getTime())) return false;

                    // Comparar año, mes y día
                    return fechaObj.getTime() == fechai1.getTime();
                });
                if(dataventas.length>0)
                  {
                     row[index] = dataventas[0].venta.toFixed(2); 
                  } else
                    {
                       row[index] = -1; 
                    }
               
                index++; 
              } 
            fechai1.setDate(fechai1.getDate() + 1);
            this.dataTabla1.push(row); 
          }
       
          let rowtotales:any[] = [];
          rowtotales[0] = '';
          rowtotales[1] = ''; 
          let itotales = 2;
        for(let suc of this.sucursalesSel)
          {
            let datasuc = this.datasucursales.filter(x=> x.idSucursal == suc.cod)[0].ventaFechas.filter(x=> x.año == this.fechafin1.getFullYear()); 
            let totalventas = datasuc.reduce((acc, item) => acc + item.venta, 0); 
            rowtotales[itotales] = totalventas.toFixed(2); 
            itotales++; 
          }
        this.dataTabla1.push(rowtotales); 

       let fechai2:Date = new Date(this.fechaini2.toDateString()); 
        while(fechai2.getTime()<= this.fechafin2.getTime())
          { 
            let row:any[] =[]; 
            let nombredia = this.diasSemana[fechai2.getDay()]; 
            fechai2.setHours(0,0,0,0);
            row[0] = nombredia; 
            let dia = fechai2.getDate()>9 ? fechai2.getDate(): '0'+fechai2.getDate(); 
            let mes = (fechai2.getMonth()+1)>9 ? (fechai2.getMonth()+1): '0'+(fechai2.getMonth()+1); 
            row[1] = dia+"/"+mes+"/"+fechai2.getFullYear(); 
            let index = 2;  
            for(let suc of this.sucursalesSel)
              {
                let datasuc = this.datasucursales.filter(x=> x.idSucursal == suc.cod); 
                let dataventas = datasuc[0].ventaFechas.filter(x => {
                    // Si x.fecha no existe, lo ignoramos
                    if (!x.fecha) return false;

                    const [year, month, day] = x.fecha.toString().split("T")[0].split("-").map(Number);
                    // Convertir a Date (asumiendo que es string o timestamp)
                    let fechaObj = new Date(year, month - 1, day);
                    // Verificar que la conversión sea válida
                    if (isNaN(fechaObj.getTime())) return false;

                    // Comparar año, mes y día
                    return fechaObj.getTime() == fechai2.getTime();
                });
                if(dataventas.length>0)
                  {
                     row[index] = dataventas[0].venta.toFixed(2); 
                  } else
                    {
                       row[index] = -1; 
                    }
               
                index++; 
              } 
            fechai2.setDate(fechai2.getDate() + 1);
            this.dataTabla2.push(row); 
          }
        
            let rowtotales2:any[] = [];
          rowtotales2[0] = '';
          rowtotales2[1] = ''; 
          let itotales2 = 2;
        for(let suc of this.sucursalesSel)
          {
            let datasuc = this.datasucursales.filter(x=> x.idSucursal == suc.cod)[0].ventaFechas.filter(x=> x.año == this.fechafin2.getFullYear()); 
            let totalventas = datasuc.reduce((acc, item) => acc + item.venta, 0); 
            rowtotales2[itotales2] = totalventas.toFixed(2); 
            itotales2++;
          }
        this.dataTabla2.push(rowtotales2); 

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


getVentasSuc(idSucursal:number):VentaFecha[]
{
  return this.datasucursales.filter(x=> x.idSucursal == idSucursal)[0].ventaFechas; 
}

detallesSucursal()
{ 
  
  this.tabladetalles = []; 
  let datasuc = this.datasucursales.filter(x=>x.idSucursal == this.valueopcion)[0];
  let dataventassuc = datasuc.ventaFechas; 
  let indexmax = datasuc.ventaFechas.length/2; 
  let totalventas = datasuc.ventaFechas.filter(x=>x.año == this.fechafin1.getFullYear()).reduce((acc, item) => acc + item.venta, 0); 
  let pptodelivery = datasuc.meta2-datasuc.metasalon; 
  for(let i=0; i<indexmax;i++)
    {
      let data:any[] = [];
      let i2 = (i+indexmax);  
      const [year, month, day] = dataventassuc[i2].fecha.toString().split("T")[0].split("-").map(Number);
      let fechaObj = new Date(year, month - 1, day);
      data[0] = this.diasSemana[fechaObj.getDay()];
       let dia = fechaObj.getDate()>9 ? fechaObj.getDate(): '0'+fechaObj.getDate(); 
       let mes = (fechaObj.getMonth()+1)>9 ? (fechaObj.getMonth()+1): '0'+(fechaObj.getMonth()+1); 
       data[1] = dia+"/"+mes+"/"+fechaObj.getFullYear();
       data[2] = dataventassuc[i].venta.toFixed(2); 
       data[3] = ((dataventassuc[i].venta/totalventas)*100).toFixed(2)+'%'
       data[4] = (datasuc.metasalon*(dataventassuc[i].venta/totalventas)).toFixed(2)
       data[5] = (pptodelivery*(dataventassuc[i].venta/totalventas)).toFixed(2)
       data[6] = (parseFloat(data[4]) + parseFloat(data[5])).toFixed(2); 
       data[7] =  datasuc.ventaFechas[i2].venta.toFixed(2);
       data[8] = datasuc.ventaFechas[i2].ventaSalon.toFixed(2); 
       data[9] = datasuc.ventaFechas[i2].ventaDelivery.toFixed(2);  
       this.tabladetalles.push(data);
    }
  this.cdr.detectChanges(); 
}

getPresupuesto(tipo:number):number
{
let fechahoy:Date = new Date(); 
  fechahoy.setHours(0,0,0,0); 
  let total:number = 0; 
  if(tipo== 1)
    {
        for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()< fechahoy.getTime())
              {
                total = total + parseFloat(item[6]);
              }
          }
    }
  if(tipo== 2)
    {
      for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()< fechahoy.getTime())
              {
                total = total + parseFloat(item[4]);
              }
          }
    }
  if(tipo== 3)
    {
      for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()< fechahoy.getTime())
              {
                total = total + parseFloat(item[5]);
              }
            
          }
    }
  if(tipo== 4)
    {
      for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()<fechahoy.getTime())
              {
                total = total + parseFloat(item[2]);
              }
          }
    }
return parseFloat(total.toFixed(2)); 
}


getVentaReal(tipo:number):number
{
  let fechahoy:Date = new Date(); 
  fechahoy.setHours(0,0,0,0); 
  let total:number = 0; 
  if(tipo== 1)
    {
        for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()< fechahoy.getTime())
              {
                total = total + parseFloat(item[7]);
              }
          }
    }
  if(tipo== 2)
    {
      for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()< fechahoy.getTime())
              {
                total = total + parseFloat(item[8]);
              }
            
          }
    }
  if(tipo== 3)
    {
      for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()<fechahoy.getTime())
              {
                  total = total + parseFloat(item[9]);
              }            
          }
    }
  if(tipo== 4)
    {
      for(let item of this.tabladetalles)
          {
            let arr_fecha = item[1].split('/')
            let fechai = new Date(arr_fecha[2],arr_fecha[1]-1,arr_fecha[0]); 
            fechai.setHours(0,0,0,0); 
            if(fechai.getTime()< fechahoy.getTime())
              {
                total = total + parseFloat(item[7]);
              }
            
          }
    }
return parseFloat(total.toFixed(2)); 
}

getDiferecia(val1:number,val2:number):string
{
   return (val2-val1).toFixed(2);
} 

getporcentaje(val1:number,val2:number):string
{
  let val:number = 0;
  val = ((val2/val1)*100)-100;  
  return val.toFixed(2); 
}

// Calcula la diferencia en días entre dos fechas (sin importar la hora)
getDaysDifference(start: Date, end: Date): number {
  if (!start || !end) return NaN;
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return (utcEnd - utcStart) / msPerDay;
}

// Validación principal
areRangesEqualDays(
  fechaini1: Date, fechafin1: Date,
  fechaini2: Date, fechafin2: Date
): boolean {
  const days1 = this.getDaysDifference(fechaini1, fechafin1);
  const days2 = this.getDaysDifference(fechaini2, fechafin2);
  return days1 === days2; // Considera usar Math.abs(days1 - days2) < 1e-8 si hay decimales
}

}
