import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    FormsModule,
    ConfirmDialogModule,
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl:'./Metas.component.html',
})
export default class MetasComponent implements OnInit {
public selectedFile:File|undefined;
public arr_metas:any[] = []; 
public animacioninput:boolean = true; 
public loading:boolean = false; 
public alerta:boolean = false; 
public mesSel:string = '2024-07'; 


constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService,private confirmationService: ConfirmationService)
{

}

  ngOnInit(): void 
  {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Meses de 0 a 11, se suma 1
    this.mesSel = `${year}-${month}`;
   }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}
ngAfterViewInit(): void {
 
  setTimeout(() => {
    this.animacioninput = false; 
    this.cdr.detectChanges(); 
  }, 1500);

}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.getdataFromFile(); 
      this.cdr.detectChanges();
    }
  }


  getdataFromFile()
  {
    this.loading = true; 
    this.apiserv.leerExcel(this.selectedFile!).subscribe({
      next: data => {
        this.loading= false; 
         this.arr_metas = data.data;
         this.selectedFile = undefined;
         console.log(this.arr_metas);
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.loading = false; 
         this.showMessage('error',"Error","Error al procesar la solicitud");
         this.cdr.detectChanges();
      }
  });
  }


  campovalido(value:any,index:number):boolean
  {
    let estatus:boolean = true
    if(index == 1)
      {
        if(value == '' || value == null)
          {
            estatus = false; 
            this.alerta = true; 
          }   
      }
    if(index == 2)
      {
        if(value == "" || isNaN(value))
          {
            estatus = estatus = false; 
            this.alerta = true; 
          } else
          {
            if(value <= 0)
              {
                estatus = estatus = false; 
                this.alerta = true; 
               }
          }
      }
      return estatus; 
  }

  cargarMetas()
  {
    this.loading = true; 
    if(this.alerta)
      {
        this.confirmationService.confirm({
          header: 'INFO',
          message: 'PARA PODER CARGAR LA INFORMACIÓN ASEGÚRESE DE QUE NINGUNA CELDA ESTÉ EN ROJO',
          acceptIcon: 'pi pi-check mr-2 me-1',
          rejectIcon: 'pi pi-times mr-2 me-1',
          rejectButtonStyleClass: 'd-none',
          acceptButtonStyleClass: 'btn bg-p-b ms-3',
          acceptLabel: 'OK',
          accept: () => {
              location.reload();
          },
          reject: () => {
            location.reload(); 
          }
      });
      } else
      { 
        let data:string = JSON.stringify(this.arr_metas); 
            this.apiserv.cargarMetas(data).subscribe({
              next: data => {
                this.arr_metas = []; 
                this.loading = false;
                this.cdr.detectChanges(); 
                this.showMessage('success','Success','Guardado correctamente');
                setTimeout(() => {
                  location.reload(); 
                }, 2500);
              },
              error: error => {
                console.log(error);
                this.loading = false;
                this.showMessage('error',"Error","Error al procesar la solicitud");
                this.cdr.detectChanges();
              }
          });
      }
  }

  descargarMachote()
  {
    this.loading = true;
    if(this.mesSel == '' || this.mesSel == null || this.mesSel == undefined)
      {
        this.showMessage('info','Info','Seleccione un mes y año para continuar');
        this.loading = false; 
        return
      }
    this.apiserv.descargarmachote(this.mesSel).subscribe({
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
        link.download = 'MACHOTE-METAS-'+this.mesSel+'.xlsx'; // Establecer el nombre del archivo
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



}
