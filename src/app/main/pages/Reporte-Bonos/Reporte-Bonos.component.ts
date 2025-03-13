import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiService } from '../../../Services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from "../../../Shared/Loader/Loader.component";
import { BonoData, MatrizBono } from '../../../Interfaces/BonoData';
import { Table, TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
@Component({
  selector: 'app-reporte-bonos',
  standalone: true,
  imports: [CommonModule,
  FormsModule,
  CalendarModule,
  MultiSelectModule,
  ToastModule,
  LoaderComponent,
  TableModule,
  InputSwitchModule
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
public simplificado:boolean = true; 
public encabezadoTabla:string[] = [];
constructor(public apiserv:ApiService,public cdr:ChangeDetectorRef,private messageService: MessageService)
{
  this.encabezadoTabla = ['Sucursal','$ Meta','$ Venta','Alcance','$ Compras','Costo','$ Alimentos Salón','$ Bebidas Salón','% Bebidas',
    'Total AYC','AYC Hot-Dor / Burguer','% AYC Hot-Dog / Burguer','Diferencias Ala','Compras Ala','% Diferencias Ala','Diferencias Boneless','Compras Boneless',
    '% Diferencias Boneless','Diferencias Papa','Compras Papa','% Diferencias Papa','Mermas Ala','% Mermas Ala','Mermas Boneless','% Mermas Boneless',
    'Mermas Papa','% Mermas Papa','% Tareas'
  ]; 
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
                porcentajehdb: item.inicioayc.porcentaje,
                difAla:item.diferenciasData.diferenciasAla,
                difBoneless:item.diferenciasData.diferenciasBoneless,
                difPapa:item.diferenciasData.diferenciasPapa,
                comprasAla:item.diferenciasData.comprasAla,
                comprasBoneless:item.diferenciasData.comprasBoneless,
                comprasPapa:item.diferenciasData.comprasPapa,
                pdifAla: item.diferenciasData.pdifAla,
                pdifBoneless: item.diferenciasData.pdifBoneless,
                pdifPapa: item.diferenciasData.pdifPapas,
                mermasAla: item.mermasdata.mermasAla,
                mermasBoneless: item.mermasdata.mermasBoneless,
                mermasPapa: item.mermasdata.mermasPapa,
                pmermasAla: item.mermasdata.pmermasAla,
                pmermasBoneless: item.mermasdata.pmermasBoneless,
                pmermasPapa: item.mermasdata.pmermasPapas,
                porcentajeTareas: item.porcentajeTareas
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

    // Función para exportar a Excel
    exportToExcel() {

      this.loading = true;
      this.apiserv.ExcelBonos(JSON.stringify(this.encabezadoTabla),JSON.stringify(this.matrizBono)).subscribe({
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
          const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
          // Crear una URL para el Blob
          const url = window.URL.createObjectURL(blob);
      
          // Crear un enlace para la descarga
          const link = document.createElement('a');
          link.href = url;
          link.download = 'REPORTE BONOS '+(this.mes.getMonth()+1)+'-'+this.mes.getFullYear()+'.xlsx'; // Establecer el nombre del archivo
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

  // clase para color de diferencias o mermas
  getClassColor(porcentaje:number):string
  {
    let clase = '';

    if(porcentaje<2.5 && porcentaje>-2.5)
      {
        clase = 'bg-success'
      }

    if(porcentaje>=2.5 || porcentaje<=-2.5)
      {
          clase = 'bg-danger'
      }
    return clase; 
  }

  getClassColoApps(porcentaje:number)
  {
    let clase = '';

    if(porcentaje>=100)
      {
        clase = 'bg-verdeOscuro'
      }

    if(porcentaje>=90 && porcentaje<100)
      {
        clase = 'bg-success'
      }

    if(porcentaje>=80 && porcentaje<90)
      {
        clase = 'bg-warning text-dark'
      }

    if(porcentaje<80)
      {
          clase = 'bg-danger'
      }
    return clase;
  }

}
