import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { VentaMeta } from '../../Interfaces/Venta';

@Component({
  selector: 'app-multimes-progress',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
  ],
  templateUrl: './MultimesProgress.component.html',
  styleUrl: './MultimesProgress.component.css',
})
export class MultimesProgressComponent implements OnInit {
  @Output() eventodetalles = new EventEmitter<VentaMeta>();
  @Input() ventas:VentaMeta[] = [];
  colorScheme:any = {
    domain: ['#4B0082', '#800080', '#9370DB', '#BA55D3'],
  };
  single:any[] = [];
  customColors = (name:number): string => {
    let Sucursal = this.single.filter(x=>x.name == name);
    let porcentaje= Sucursal[0].porcentaje;

    let color = '#6D28D9'; 
    if(porcentaje<75)
      {
        color = '#d9003e';
      }

    if(porcentaje<100 && porcentaje>74)
          {
            color = '#ffc500';
          }

    if(porcentaje>=100)
      {
        color = '#39df18';
      }
      return color;
  };
constructor(public cdr:ChangeDetectorRef)
{
  
}
  ngOnInit(): void 
  {
    // this.ventas.sort((a, b) => {
    //   // Comparar por año primero
    //   if (a.year !== b.year) {
    //     return a.year - b.year;
    //   }
    //   // Si los años son iguales, comparar por mes
    //   return a.month - b.month;
    // });
    for(let item of this.ventas)
      {
          this.single.push({name:this.getNameMonth(item.month)+' '+item.year,value:item.ventaTotal,porcentaje:item.cumplimiento});
      }
      this.cdr.detectChanges();
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

verdetalles(item:VentaMeta)
{
  this.eventodetalles.emit(item);
}


}
