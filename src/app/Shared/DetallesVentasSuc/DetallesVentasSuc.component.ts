import { ChangeDetectorRef, Component, Input, type OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { Sucursal } from '../../Interfaces/Sucursal';
import { LoaderComponent } from "../Loader/Loader.component";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { DetallesVenta2, DetallesVentas3, VentaMeta } from '../../Interfaces/Venta';
import { ProgressBarCComponent } from "../ProgressBarC/ProgressBarC.component";

@Component({
  selector: 'app-detalles-ventas-suc',
  standalone: true,
  imports: [
    LoaderComponent,
    CommonModule,
    NgxChartsModule,
    ProgressBarCComponent
],
  providers:[MessageService],
  templateUrl: './DetallesVentasSuc.component.html',
})
export class DetallesVentasSucComponent implements OnInit {
@Input() fechaSel:Date = new Date(); 
@Input() dataSuc:Sucursal|undefined; 

fechastr:string = ''; 
 public catsucursales:Sucursal[] = [];
  public loading:boolean = false; 
  public loadingdet:boolean = false; 
  public loadingdetv2:boolean = false; 
  public loadingdetv3:boolean = false; 
  public detallesventas:any;
  public detallesventas2:DetallesVenta2|undefined;
  public totaldetallesventa2:number = 0; 
  public detalles3:DetallesVentas3 | undefined; 
  single: any[] = [];
  detallesventa2G:any[] = []; 
  public arrdetalles:any[] = [];
  public arrdetallesUber:any[] = [];
  public arrdetallesRappi:any[] = [];
  public arrdetallesDidi:any[] = [];
public itemdetalles:VentaMeta | undefined; 
public itemdetallesSalon:VentaMeta | undefined; 
  
  colorSchemedet:any = {
    domain: [
      "#d9003e", // rojo
      '#ffc500', // amarillo
      '#39df18', // verde
      '#00c2ed', // azul
      '#ec7613' // naranja
    ]
  };

  colorSchemedetApp:any = {
    domain: [
      "#7B1FA2", // Púrpura profundo
      "#F06292", // Rosa brillante
      "#2196F3", // Azul intenso
      "#FF9800", // Naranja
      "#9C27B0", // Púrpura
      "#E91E63", // Rosa oscuro
      "#FF5722"  // Naranja oscuro
    ]
  }
  colorSchemedetR:any = {
    domain: [
      '#00c2ed', // azul
    ]
  }
  colorSchemedetD:any = {
    domain: [
      '#ec7613' // naranja
    ]
  }



    constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService,private router: Router)
    {
      debugger
        this.fechastr = this.fechaSel!.getFullYear()+'-'+(this.fechaSel!.getMonth()+1); 
    }

  ngOnInit(): void 
  {
    let arr_suc_id:Sucursal[] = []; 
     arr_suc_id.push(this.dataSuc!); 
     let jdata = JSON.stringify(arr_suc_id);  

    this.apiserv.getDash(this.fechastr,jdata,false).subscribe({
      next: data => {
         this.itemdetalles = data[0]; 
         this.loading = false; 
         this.single = [];           
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.loading = false; 
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  this.apiserv.getDash(this.fechastr,jdata,true).subscribe({
      next: data => {
         this.itemdetallesSalon = data[0]; 
         this.loading = false;       
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.loading = false; 
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

    this.apiserv.getDetallesVentas(this.dataSuc!.cod,this.fechastr).subscribe({
      next: data => {
        this.detallesventas = data;
        this.loadingdet = false; 

        this.arrdetalles = []; 
        this.arrdetalles.push({name:'SALÓN',value:data.ventasalon}); 
        this.arrdetalles.push({name:'PICK UP',value:data.ventapickup}); 
        this.arrdetalles.push({name:'UBER',value:data.ventauber}); 
        this.arrdetalles.push({name:'RAPPI',value:data.ventarappi}); 
        this.arrdetalles.push({name:'DIDI',value:data.ventadidi}); 

        this.arrdetallesUber.push({name:'CHIKEN OCLOCK',value:data.uberco});
        this.arrdetallesUber.push({name:'FUNKY COW',value:data.uberfc});
        this.arrdetallesUber.push({name:'REBEL WINGS',value:data.uberrw});

        this.arrdetallesDidi.push({name:'CHIKEN OCLOCK',value:data.didico});
        this.arrdetallesDidi.push({name:'FUNKY COW',value:data.didifc});
        this.arrdetallesDidi.push({name:'REBEL WINGS',value:data.didirw});
        this.arrdetallesDidi.push({name:'WINGS DEALERS',value:data.didiwd});

        this.arrdetallesRappi.push({name:'CHIKEN OCLOCK',value:data.rappico});
        this.arrdetallesRappi.push({name:'FUNKY COW',value:data.rappifc});
        this.arrdetallesRappi.push({name:'REBEL WINGS',value:data.rappirw});
        this.arrdetallesRappi.push({name:'WINGS DEALERS',value:data.rappiwd});
      
        this.loadingdetv2 = true; 
         this.cdr.detectChanges();
         this.getdetallesventas2(this.dataSuc!.cod); 
      },
      error: error => {
         console.log(error);
         this.loadingdet = false; 
         this.loadingdetv2 = false; 
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

   }


   getdetallesventas2(ids:number)
   { 
     this.apiserv.getDetallesVentas2(this.dataSuc!.cod,this.fechastr).subscribe({
       next: data => {
         console.log(data);
         this.detallesventas2 = data;
         this.detallesventa2G = []; 
         this.detallesventa2G.push({name:'DESCUENTOS',value:this.detallesventas2!.descuentos});  
         this.detallesventa2G.push({name:'MERMAS',value:this.detallesventas2!.mermas});  
         this.detallesventa2G.push({name:'CANCELACIONES',value:this.detallesventas2!.cancelaciones});  
         this.detallesventa2G.push({name:'INVITACIONES',value:this.detallesventas2!.invitaciones});  
         this.detallesventa2G.push({name:'CONSUMOS INTERNOS',value:this.detallesventas2!.consumoInterno});  
         this.totaldetallesventa2 =0;
         
         for(let item of this.detallesventa2G)
           {
             this.totaldetallesventa2 = this.totaldetallesventa2 + item.value; 
           }
 
         this.loadingdetv2 = false; 
         this.getdetallesventas3(ids); 
          this.cdr.detectChanges();
       },
       error: error => {
          console.log(error);
          this.loadingdetv2 = false; 
          this.showMessage('error',"Error","Error al procesar la solicitud");
       }
   });
 
   }
 
   getdetallesventas3(ids:number)
   {
     this.loadingdetv3 = true; 
     this.apiserv.getDetallesVentas3(this.dataSuc!.cod, this.fechastr).subscribe({
       next: data => {
         this.detalles3 = data; 
         this.loadingdetv3 = false; 
          this.cdr.detectChanges();
       },
       error: error => {
          console.log(error);
          this.loadingdetv3 = false; 
          this.showMessage('error',"Error","Error al procesar la solicitud");
       }
   });
 
   }



   showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

compararvsventas(valor:number):number
{
  let porcentaje = 0; 
  if(this.itemdetalles!.ventaTotal>0)
    {
      porcentaje = valor/this.itemdetalles!.ventaTotal*100
    }
  return porcentaje; 
}

compararvstotal(valor:number):number
{
  let porcentaje = 0
  if(this.totaldetallesventa2>0)
    {
      porcentaje = valor/this.totaldetallesventa2*100
    }
  return porcentaje; 
}

getNameMonth(number:number):string
{
  let name = ''; 
  if(number == 1)
  {
    name = 'ENERO';
  }
  if(number == 2)
  {
    name = 'FEBRERO';
  }
  if(number == 3)
  {
    name = 'MARZO';
  }
  if(number == 4)
  {
    name = 'ABRIL';
  }
  if(number == 5)
    {
      name = 'MAYO';
    }
  if(number == 6)
  {
    name = 'JUNIO';
  }
  if(number == 7)
  {
    name = 'JULIO';
  }
  if(number == 8)
  {
    name = 'AGOSTO';
  }
  if(number == 9)
  {
    name = 'SEPTIEMBRE';
  }
  if(number == 10)
  {
    name = 'OCTUBRE';
  }
  
  if(number == 11)
    {
      name = 'NOVIEMBRE';
    }

  if(number == 12)
  {
    name = 'DICIEMBRE';
  }

  return name; 
}

getbgdet(porcentaje:number)
{
  let color = '';
    if(porcentaje<75)
      {
        color ='#d9003e';  
      }

    if(porcentaje<100 && porcentaje>=75)
          {
            color = '#ffc500';
          }

    if(porcentaje>=100)
      {
        color = '#39df18';
      }
    return color; 
}

getbgdeti(porcentaje:number)
{
  let color = '';
    if(porcentaje<75)
      {
        color = '#39df18';
      }

    if(porcentaje<100 && porcentaje>=75)
          {
            color = '#ffc500';
          }

    if(porcentaje>=100)
      {
      
        color ='#d9003e';  
      }
    return color; 
}


}
