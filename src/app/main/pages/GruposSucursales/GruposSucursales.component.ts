import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { DialogModule } from 'primeng/dialog';
import { Agrupador } from '../../../Interfaces/Agrupador';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-grupos-sucursales',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    DialogModule, 
    LoaderComponent,
    ConfirmDialogModule,
    TagModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './GruposSucursales.component.html',
})
export default class GruposSucursalesComponent implements OnInit {
public loading:boolean = false; 
public catsucursales:Sucursal[] = [];
public sucursalesSel:Sucursal[] = [];
public modalAgregar:boolean = false; 
public actualizar:boolean = false; 
public formnombre:string = ''; 

public arr_data:Agrupador[] = []; 
public itemSel:Agrupador|undefined; 

constructor(public apiserv:ApiService, private messageService: MessageService,public cdr:ChangeDetectorRef,private confirmationService: ConfirmationService)
{}

ngOnInit(): void 
{
  this.getSucursales();   
  this.getAgrupadores(); 
 }
showMessage(sev:string,summ:string,det:string) {
  this.messageService.add({ severity: sev, summary: summ, detail: det }); 
}

getAgrupadores()
{
  this.loading= true;
  this.apiserv.getAgrupadores().subscribe({
   next: data => {
      this.arr_data=data;
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

 abrirmodalAgregar()
 {
  this.actualizar = false; 
  this.sucursalesSel = []; 
  this.formnombre = ''; 
  this.modalAgregar = true; 
 } 

getSucursalesGrupo(jdata:string):Sucursal[]
{
  let sucursales:Sucursal[] = [];
  let obj = JSON.parse(jdata); 

  for(let item of obj)
    {
      let suc = this.catsucursales.filter(x=>x.cod == item); 
      if(suc.length>0){ sucursales.push(suc[0]); }
    }

  return sucursales; 
}

editar(item:Agrupador)
{
  this.itemSel = item; 
  this.sucursalesSel = []; 
  this.formnombre = item.nombre; 
  let obj = JSON.parse(item.jdata); 

  for(let item of obj)
    {
      let suc = this.catsucursales.filter(x=>x.cod == item); 
      if(suc.length>0){ this.sucursalesSel.push(suc[0]); }
    }

    this.actualizar = true; 
    this.modalAgregar = true;
    this.cdr.detectChanges();
}

eliminar(id:number)
{
  this.apiserv.eliminarAgrupador(id).subscribe({
    next: data => {
      this.showMessage('success',"Success","Eliminado correctamente");
      this.getAgrupadores(); 
       this.loading = false;
       this.cdr.detectChanges();
    },
    error: error => {
       this.loading = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

confirm(id:number) {
  this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptButtonStyleClass:"btn bg-p-b p-3",
      rejectButtonStyleClass:"btn btn-light me-3 p-3",
      accept: () => {
         this.eliminar(id);
      },
      reject: () => {
          
      }
  });
}

agregar()
{
  if(this.formnombre == '')
    {
      this.showMessage('info','Info','Ingrese el nombre del grupo');
      return;
    }
  if(this.sucursalesSel.length==0)
    {
      return;
    }

    let data:number[] = []; 

    for(let suc of this.sucursalesSel)
      {
        data.push(suc.cod); 
      }

      this.loading= true;
      this.apiserv.AgregarAgrupador(this.formnombre,JSON.stringify(data)).subscribe({
       next: data => {

        this.formnombre = ''; 
        this.sucursalesSel = [];
        this.modalAgregar = false; 
        this.showMessage('success',"Success","Agregado correctamente");
        this.getAgrupadores(); 
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

Actualizar()
{
  if(this.formnombre == '')
    {
      this.showMessage('info','Info','Ingrese el nombre del grupo');
      return;
    }
  if(this.sucursalesSel.length==0)
    {
      return;
    }

    let data:number[] = []; 

    for(let suc of this.sucursalesSel)
      {
        data.push(suc.cod); 
      }

      this.loading= true;
      this.apiserv.ActualizarAgrupador(this.itemSel!.id,this.formnombre,JSON.stringify(data)).subscribe({
       next: data => {

        this.formnombre = ''; 
        this.sucursalesSel = [];
        this.modalAgregar = false; 
        this.showMessage('success',"Success","Actualizado correctamente");
        this.getAgrupadores(); 
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
