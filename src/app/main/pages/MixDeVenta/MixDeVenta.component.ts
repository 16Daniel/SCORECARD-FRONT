import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../Services/api.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MixSucComponent } from './MixSuc/MixSuc.component';
import { MixVenta } from '../../../Interfaces/Venta';


@Component({
  selector: 'app-mix-de-venta',
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    ToastModule,
    FormsModule,
    CalendarModule,
    LoaderComponent,
    NgxChartsModule,
    MixSucComponent
  ],
  providers:[MessageService],
  templateUrl: './MixDeVenta.component.html',
})
export default class MixDeVentaComponent implements OnInit {
  public arr_data:MixVenta[] = []; 
  public catsucursales:Sucursal[] = [];
  public sucursalesSel:Sucursal[] = [];
  public loading:boolean = false; 
  public loading2:boolean = false; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  public datag:any[] =[]; 
  public datags:any[] = []; 
  public datagd:any[] = []; 
  public datagp:any[] = []; 

      // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'IMPORTE';
  animations: boolean = true;

  
    colorScheme:any = {
      domain: ['#00f7ff', '#ff00f7 ', '#a8385d', '#aae3f5']
    };
  

  ngOnInit(): void { }

  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
  {
    this.getSucursales(); 
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

 getMixData()
 {
  this.arr_data = []; 
  this.datag = []; 
  this.datags = []; 
  this.datagd = []; 
  this.datagp = []; 
    let sucursales:number[] = []; 
    for(let item of this.sucursalesSel)
      {
        sucursales.push(item.cod); 
      }

  this.loading= true;
  this.apiserv.getMixDeVentas(JSON.stringify(sucursales),this.formatDate(this.getPreviousSunday(this.fechaini)),this.formatDate(this.getNextSaturday(this.fechafin))).subscribe({
   next: data => {
      this.arr_data = data; 
      this.loading = false;
        console.log(this.arr_data);

        let t_a_s = this.arr_data.reduce((acumulador, elemento) => {
            return acumulador + elemento.alimentosSalon;
        }, 0);

        let t_b_s = this.arr_data.reduce((acumulador, elemento) => {
          return acumulador + elemento.bebidasSalon;
      }, 0);

          let t_a_d = this.arr_data.reduce((acumulador, elemento) => {
            return acumulador + elemento.alimentosDelivery;
        }, 0);

        let t_b_d = this.arr_data.reduce((acumulador, elemento) => {
          return acumulador + elemento.bebidasDelivery;
      }, 0);

              let t_a_p = this.arr_data.reduce((acumulador, elemento) => {
                return acumulador + elemento.alimentosPickup;
            }, 0);

            let t_b_p = this.arr_data.reduce((acumulador, elemento) => {
              return acumulador + elemento.bebidasPickup;
          }, 0);

        let tot_salon = t_a_s + t_b_s; 
        let tot_delivery = t_a_d + t_b_d; 
        let tot_pickup = t_a_p + t_b_p; 

        this.datags.push({name:'Alimentos',value:t_a_s}); 
        this.datags.push({name:'Bebidas',value:t_b_s}); 

        this.datagd.push({name:'Alimentos',value:t_a_d});
        this.datagd.push({name:'Bebidas',value:t_b_d}); 

        this.datagp.push({name:'Alimentos',value:t_a_p}); 
        this.datagp.push({name:'Bebidas',value:t_b_p}); 

        this.datag.push({name:"Salón",series:this.datags});
        this.datag.push({name:"Delivery",series:this.datagd});
        this.datag.push({name:"Pickup",series:this.datagp});

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

getDataSuc(ids:number):MixVenta[]
{
  let data = this.arr_data.filter(x=> x.ids == ids); 
  return data; 
}

limpiardata()
{
  this.arr_data = []; 
}


}
