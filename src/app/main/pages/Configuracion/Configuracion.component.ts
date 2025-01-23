import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../Services/api.service';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../Shared/Loader/Loader.component';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    ToastModule
  ],
  providers:[MessageService],
  templateUrl: './Configuracion.component.html',
})
export default class ConfiguracionComponent implements OnInit {
public loading:boolean = false; 
public costoPresupuestado:number = 44;
public iniwings:number = 25;
public iniboneless:number = 25; 
public iniburger:number = 25; 
public inihotdog:number = 25; 


  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
  {
  
  }
  ngOnInit(): void 
  {
    this.getparametros(); 
   }
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

getparametros()
{
  this.loading= true;
     this.apiserv.getparametros().subscribe({
      next: data => {
        if(data != null)
          {
            var obj = JSON.parse(data.jdata); 
            this.costoPresupuestado = obj.costopresupuestado; 
            this.iniwings = obj.iniwings;
            this.iniboneless = obj.iniboneless;
            this.iniburger = obj.iniburger; 
            this.inihotdog = obj.inihotdog; 
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


saveparametros()
{
  this.loading= true;
  let data = 
  {
    costopresupuestado: this.costoPresupuestado,
    iniwings: this.iniwings,
    iniboneless: this.iniboneless,
    iniburger: this.iniburger,
    inihotdog: this.inihotdog
  }
  this.apiserv.saveParametros(JSON.stringify(data)).subscribe({
   next: data => {
      this.loading = false;
      this.showMessage('success',"Success","Guardado correctamente");
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
