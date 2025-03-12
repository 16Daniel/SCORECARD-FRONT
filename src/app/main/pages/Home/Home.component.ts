import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {id, NgxChartsModule} from '@swimlane/ngx-charts';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../Services/api.service';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ProgressBarCComponent } from "../../../Shared/ProgressBarC/ProgressBarC.component";
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { DetallesArt, DetallesVenta2, DetallesVentas3, VentaMeta } from '../../../Interfaces/Venta';
import { Dialog, DialogModule } from 'primeng/dialog';
import { MultimesProgressComponent } from '../../../Shared/MultimesProgress/MultimesProgress.component';
import { Router, withDebugTracing } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MultiSelectModule,
    ToastModule,
    FormsModule,
    ProgressBarCComponent,
    LoaderComponent,
    DialogModule,
    MultimesProgressComponent,
    CalendarModule
],
  providers:[MessageService],
  templateUrl: './Home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  @ViewChild('myDialog') myDialog: Dialog | undefined;
  public catsucursales:Sucursal[] = [];
  public selectedSuc:Sucursal[] = [];
  public ventasmetas:VentaMeta[] = [];
  public mesSel:string = ''; 
  public loading:boolean = false; 
  public loadingdet:boolean = false; 
  public loadingdetv2:boolean = false; 
  public loadingdetv3:boolean = false; 
  public modalDetalles:boolean = false;
  public itemdetalles:VentaMeta | undefined; 
  public porcentajegeneralv:number = 0; 
  public porcentajegeneralw:number = 0; 
  public metageneral:number = 0;
  public ventatotal:number = 0; 
  public sucursalesRojo:number = 0;
  public sucursalesAmarillo:number = 0;
  public sucursalesVerde:number = 0; 
  public detallesventas:any;
  public detallesventas2:DetallesVenta2|undefined;
  public totaldetallesventa2:number = 0; 
  public detalles3:DetallesVentas3 | undefined; 
  public detallesarts:DetallesArt[] = []; 
  public modaldetallesart:boolean = false; 
  public loadingdetarts:boolean = false; 
  public graficaDetArt:any[]=[]; 
  public titulodetalles:string = ''; 
  // Datos de la gráfica
  single: any[] = [];
  detallesventa2G:any[] = []; 
  public arrdetalles:any[] = [];
  public arrdetallesUber:any[] = [];
  public arrdetallesRappi:any[] = [];
  public arrdetallesDidi:any[] = [];

  public tipoconsulta:number = 1; 
  public fechas:string[] =[]; 
  selectedMonths:Date[] = []; 
  public modalfecha:boolean = false; 
  public sucursalesdistintas:number[] = [];
  public colorScale:any[] = [
    {color1:'#d9003e',color2:'#ffbcbc'}, // 0% (Rojo)
    {color1:'#e53e11',color2:'#ffcec0'}, // 30 naranja
    {color1:'#ffc500',color2:'#fff9c3'}, // 60 amarillo
    {color1:'#39df18',color2:'#c5ffc8'}, // 80 verde
  ];


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

  customColors = (name:number): string => {
    let Sucursal = this.single.filter(x=>x.name == name);
    let porcentaje= Sucursal[0].porcentaje;

    let color = '#6D28D9'; 
    if(porcentaje<75)
      {
        color = '#d9003e';
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
  };

  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService,private router: Router)
  {
    if(localStorage.getItem("rwuserdataDash") == null)
      {
        this.router.navigate(["/auth"]);
      }
  }

  ngOnInit(): void 
  {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Meses de 0 a 11, se suma 1
    this.mesSel = `${year}-${month}`;

    this.getSucursales(); 
   }

   showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}
  onSelect(event:any) {
    console.log(event);
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

  consultarDash()
  {
    this.loading =true; 
    if(this.fechas.length==0)
      {
        this.showMessage('info',"Error","Seleccione uno o mas meses");
        this.loading = false; 
        return;
      }
      if(this.selectedSuc.length == 0)
        {
          this.showMessage('info',"Error","Seleccione una o mas sucursales");
          this.loading = false; 
          return;
        }
      if(this.tipoconsulta == 0)
        {
          this.showMessage('info',"Error","Seleccione una opción de lo que desea consultar");
          this.loading = false; 
          return;
        }

      let jdata = JSON.stringify(this.selectedSuc); 

    if(this.fechas.length==1)
      {
        this.apiserv.getDash(this.fechas[0],jdata).subscribe({
          next: data => {
             this.ventasmetas = data; 
             this.loading = false; 
             this.single = []; 
             this.ventatotal=0;
             this.metageneral = 0; 
             this.porcentajegeneralv = 0;
             this.sucursalesRojo = 0;
             this.sucursalesAmarillo=0;
             this.sucursalesVerde = 0; 
             this.porcentajegeneralw =0;
             for(let item of this.ventasmetas)
              {
                this.single.push({name:item.nombreSucursal,value:item.ventaTotal,porcentaje:item.cumplimiento});
                this.contarD(item.ventaTotal,item.meta,item.cumplimiento); 
              }
              this.ventasmetas.sort((a, b) => a.cumplimiento - b.cumplimiento);
              this.single.sort((a, b) => a.porcentaje - b.porcentaje);
    
              if(this.metageneral>0)
                {
                  this.porcentajegeneralv = (this.ventatotal/this.metageneral)*100; 
                  if(this.porcentajegeneralv>100)
                    {
                      this.porcentajegeneralw = 100; 
                    }else { this.porcentajegeneralw = this.porcentajegeneralv;}
                }
              
             this.cdr.detectChanges();
          },
          error: error => {
             console.log(error);
             this.loading = false; 
             this.showMessage('error',"Error","Error al procesar la solicitud");
          }
      });
      } else
      {
        this.sucursalesdistintas = []; 
        this.apiserv.getDashMeses(JSON.stringify(this.fechas),jdata).subscribe({
          next: data => {
             this.ventasmetas = data; 
             this.loading = false; 
             this.single = []; 
             this.ventatotal=0;
             this.metageneral = 0; 
             this.porcentajegeneralv = 0;
             this.sucursalesRojo = 0;
             this.sucursalesAmarillo=0;
             this.sucursalesVerde = 0; 
             this.porcentajegeneralw =0;
             this.sucursalesdistintas = [...new Set(this.ventasmetas.map(sucursal => sucursal.ids))];
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

  verdetalles(item:VentaMeta)
  {
    this.arrdetalles=[]; 
    this.arrdetallesDidi =[];
    this.arrdetallesRappi = [];
    this.arrdetallesUber = []; 
    this.itemdetalles = item;   
    this.modalDetalles= true; 
    this.loadingdet = true; 
    this.detalles3 = undefined; 
    this.detallesventas2 = undefined
   // this.myDialog!.maximize();

    this.apiserv.getDetallesVentas(item.ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
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
        console.log(this.arrdetalles,this.single); 

        this.loadingdetv2 = true; 
         this.cdr.detectChanges();
         this.getdetallesventas2(item.ids); 
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
    this.apiserv.getDetallesVentas2(ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
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
    this.apiserv.getDetallesVentas3(ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
      next: data => {
        this.detalles3 = data; 
        console.log(this.detalles3); 
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

  onDialogHide()
  {
    this.loading= false; 
    this.loadingdetv2 = false; 
    this.itemdetalles = undefined;
    this.detallesventas2 = undefined; 
  }

  contarD(ventas:number,meta:number,porcentaje:number)
  {
    this.ventatotal=this.ventatotal+ventas; 
    this.metageneral = this.metageneral +meta;  
    if(porcentaje<75)
      {
        this.sucursalesRojo++; 
      }

    if(porcentaje<100 && porcentaje>=75)
          {
            this.sucursalesAmarillo++
          }

    if(porcentaje>=100)
      {
        this.sucursalesVerde++
      }
  }


  getbgGeneral():string
  {
    let bg = ""; 
    let color1 = ''; 
    let color2 = ''; 
    let porcentajeesperado = this.ventasmetas[0].cumplimientoesperado; 
    if(this.porcentajegeneralw>100){ this.porcentajegeneralw = 100}

    if(this.porcentajegeneralw<75)
      {
         color1 = this.colorScale[0].color1;
          color2 = this.colorScale[0].color2; 
      }

    if(this.porcentajegeneralw<100 && this.porcentajegeneralw>=75)
          {
             color1 = this.colorScale[2].color1;
              color2 = this.colorScale[2].color2; 
          }

    if(this.porcentajegeneralw==100)
      {
        color1 = this.colorScale[3].color1;
        color2 = this.colorScale[3].color2; 
      }

     
      bg = `linear-gradient(
        to right, 
        ${color1} 0%, 
        ${color1} ${this.porcentajegeneralw}%,
        ${color2} ${this.porcentajegeneralw}%, 
        ${color2} ${porcentajeesperado}%,
        rgb(87, 86, 88) 0%, 
        rgb(87, 86, 88) 100% 
    )`
      return bg; 
  }

  getPorcentajeSucR():number
  {
     if(this.sucursalesRojo>0)
      {
        return (this.sucursalesRojo/this.selectedSuc.length*100)
      }else{ return 0;}
  }

  getPorcentajeSucA():number
  {
     if(this.sucursalesAmarillo>0)
      {
        return (this.sucursalesAmarillo/this.selectedSuc.length*100)
      }else{ return 0;}
  }

  getPorcentajeSucV():number
  {
     if(this.sucursalesVerde>0)
      {
        return (this.sucursalesVerde/this.selectedSuc.length*100)
      }else{ return 0;}
  }

  getcolorPB():string
  {
    let color = '';
    if(this.porcentajegeneralw<75)
      {
        color ='#fff';  
      }

    if(this.porcentajegeneralw<100 && this.porcentajegeneralw>=75)
          {
            color = '#000';
          }

    if(this.porcentajegeneralw==100)
      {
        color = '#fff';
      }
    return color; 
  }

  public addfecha()
  {
      this.modalfecha = true;
      this.mesSel = ''; 
  }

  addf()
  {
    this.modalfecha = false; 
  }

  deleteF(index:number)
  {
    this.fechas.splice(index, 1);
    this.selectedMonths.splice(index, 1);
    this.ventasmetas = []; 
    this.cdr.detectChanges(); 

  }

  filtrardata(ids:number)
  {
      let data = this.ventasmetas.filter(x => x.ids == ids); 
      
      return data.sort((a, b) => {
        // Comparar por año primero
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        // Si los años son iguales, comparar por mes
        return a.month - b.month;
      });

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

compararvstotal(valor:number):number
{
  let porcentaje = 0
  if(this.totaldetallesventa2>0)
    {
      porcentaje = valor/this.totaldetallesventa2*100
    }
  return porcentaje; 
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

getDetallesDescuentos(item:VentaMeta)
{
  this.titulodetalles = 'DESCUENTOS ';
  this.detallesarts = []; 
  this.graficaDetArt = [];
  this.modaldetallesart = true; 
  this.loadingdetarts = true; 
  this.apiserv.getDetallesDescuentos(item.ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
    next: data => {
      this.detallesarts = data; 

      for(let item of this.detallesarts)
        {
          if(this.graficaDetArt.length<5)
            {
              this.graficaDetArt.push({name:item.descripcion,value:item.importe});
            }
        }

      this.loadingdetarts = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loadingdetarts = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


getDetallesMermas(item:VentaMeta)
{
  this.titulodetalles = 'MERMAS ';
  this.detallesarts = []; 
  this.graficaDetArt = [];
  this.modaldetallesart = true; 
  this.loadingdetarts = true; 
  this.apiserv.getDetallesMermas(item.ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
    next: data => {
      this.detallesarts = data; 

      for(let item of this.detallesarts)
        {
          if(this.graficaDetArt.length<5)
            {
              this.graficaDetArt.push({name:item.descripcion,value:item.importe});
            }
           
        }

      this.loadingdetarts = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loadingdetarts = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

getDetallesCancelaciones(item:VentaMeta)
{
  this.titulodetalles = 'CANCELACIONES ';
  this.detallesarts = []; 
  this.graficaDetArt = [];
  this.modaldetallesart = true; 
  this.loadingdetarts = true; 
  this.apiserv.getDetallesCancelaciones(item.ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
    next: data => {
      this.detallesarts = data; 

      for(let item of this.detallesarts)
        {
          if(this.graficaDetArt.length<5)
            {
              this.graficaDetArt.push({name:item.descripcion,value:item.importe});
            }
        }

      this.loadingdetarts = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loadingdetarts = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

getDetallesInvitaciones(item:VentaMeta)
{
  this.titulodetalles = 'INVITACIONES ';
  this.detallesarts = []; 
  this.graficaDetArt = [];
  this.modaldetallesart = true; 
  this.loadingdetarts = true; 
  this.apiserv.getDetallesInvitaciones(item.ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
    next: data => {
      this.detallesarts = data; 

      for(let item of this.detallesarts)
        {
          if(this.graficaDetArt.length<5)
            {
              this.graficaDetArt.push({name:item.descripcion,value:item.importe});
            }
        }

      this.loadingdetarts = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loadingdetarts = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

getDetallesConsumeInterno(item:VentaMeta)
{
  this.titulodetalles = 'CONSUMOS INTERNOS ';
  this.detallesarts = []; 
  this.graficaDetArt = [];
  this.modaldetallesart = true; 
  this.loadingdetarts = true; 
  this.apiserv.getDetallesConsumoInterno(item.ids,this.itemdetalles!.year+'-'+this.itemdetalles!.month).subscribe({
    next: data => {
      this.detallesarts = data; 

      for(let item of this.detallesarts)
        {
          if(this.graficaDetArt.length<5)
            {
              this.graficaDetArt.push({name:item.descripcion,value:item.importe});
            }
        }

      this.loadingdetarts = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loadingdetarts = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
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

formatDates() {
  this.fechas = this.selectedMonths.map(date => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}`;
  });
}

 }