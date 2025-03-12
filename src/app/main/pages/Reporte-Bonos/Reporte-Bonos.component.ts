import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiService } from '../../../Services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from "../../../Shared/Loader/Loader.component";
import { BonoData, MatrizBono } from '../../../Interfaces/BonoData';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-bonos',
  standalone: true,
  imports: [CommonModule,
  FormsModule,
  CalendarModule,
  MultiSelectModule,
  ToastModule,
  LoaderComponent,
  TableModule
],
  providers:[MessageService],
  templateUrl: './Reporte-Bonos.component.html',
})
export default class ReporteBonosComponent implements OnInit {
public mes:Date = new Date();
public catsucursales:Sucursal[] = [];
public selectedSuc:Sucursal[] = [];
public loading:boolean = false; 
public maxDate:Date = new Date();
public bonodata:BonoData[] = []; 
public matrizBono:MatrizBono[]= []
constructor(public apiserv:ApiService,public cdr:ChangeDetectorRef,private messageService: MessageService)
{

}

  ngOnInit(): void 
  {
    const now = new Date();
    this.maxDate = new Date(now.getFullYear(), now.getMonth(), 0);
    this.mes = this.maxDate;
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

  Consultar()
  {  
    if(this.selectedSuc.length==0)
      {
        this.showMessage('info','Info','Favor de seleccionar una o más sucursales');
        return;
      }
      this.bonodata = []; 
      this.matrizBono = []; 
    let jdata:number[] = [];
    for(let item of this.selectedSuc)
      {
        jdata.push(item.cod); 
      }
    this.loading= true;
     this.apiserv.getBonosData(JSON.stringify(jdata),this.mes).subscribe({
      next: data => {
        this.bonodata = data; 
        console.log(this.bonodata);
        for(let item of this.bonodata)
          {
            this.matrizBono.push(
              {
                ids: item.alcanceDeVentas.ids,
                sucursal: item.alcanceDeVentas.nombreSucursal,
                metaVenta: item.alcanceDeVentas.meta,
                ventaReal: item.alcanceDeVentas.ventaTotal,
                alcance: item.alcanceDeVentas.cumplimiento,
                compras: item.costosSucursales.compras,
                costo: item.costosSucursales.costo,
                ventaAlimentosSalon: item.pBebidas.ventaAlimentosSalon,
                ventaBebidasSalon: item.pBebidas.ventaBebidasSalon,
                porcentajeBebidas: item.pBebidas.porcentaje,
                totalayc: item.inicioayc.totalayc,
                inicioaychdb: item.inicioayc.inicioHDB,
                porcentajehdb: item.inicioayc.porcentaje
              });
          }

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
}
