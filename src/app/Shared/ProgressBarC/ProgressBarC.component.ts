import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar-c',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ProgressBarC.component.html',
  styleUrl: './ProgressBarC.component.css',
})
export class ProgressBarCComponent { 
  @Input() nombresuc:string='';
  @Input() idpbc:string='';
  @Input() progressEndValue:number = 0;
  @Input() cumplimientoesp:number = 0;
  @Input() proyeccion:number = 0;
  public color1:string = '';
  public color2:string = '';
  public progressValue:number=0;
  @Input() metav:number = 0; 
  @Input() totalv:number = 0;
  public colorScale:any[] = [
    {color1:'#d9003e',color2:'#ffbcbc'}, // 0% (Rojo)
    {color1:'#e53e11',color2:'#ffcec0'}, // 30 naranja
    {color1:'#ffc500',color2:'#fff9c3'}, // 60 amarillo
    {color1:'#39df18',color2:'#c5ffc8'}, // 80 verde
  ];

  constructor(public cdr:ChangeDetectorRef){}
  ngAfterViewInit(): void 
  {
    this.cdr.detectChanges(); 
    let colores = this.getColores(this.progressEndValue);
    this.color1 = colores.color1;
    this.color2 = colores.color2; 

    let progressBar: HTMLElement | null  = document.getElementById(this.idpbc); 
    let valueContainer = document.getElementById(this.idpbc+'container')
    let speed = 20;
    
    let progress = setInterval(() => {
      this.progressValue++;
      if(this.progressValue>this.progressEndValue){ this.progressValue = this.progressEndValue; }
      let temp = this.progressValue.toFixed(2); 
      valueContainer!.innerHTML = `${temp}%<p>${this.nombresuc}</p>`;
      progressBar!.style.background = `conic-gradient(
          ${this.color1} 0deg ${this.progressValue * 3.6}deg,
          ${this.color2} ${this.progressValue * 3.6}deg ${this.cumplimientoesp * 3.6}deg,
          #575658 0deg 360deg
      )`;
      if (this.progressValue >= this.progressEndValue) {
        clearInterval(progress);
        let temp = this.progressValue.toFixed(2); 
        valueContainer!.innerHTML = `${temp}%<p>${this.nombresuc}</p>`;
      }
    }, speed);
   }

   getColores(procentaje:number):any
   {
      if(procentaje<75)
        {
          return this.colorScale[0]; 
        }

          if(procentaje<100)
            {
              return this.colorScale[2]; 
            }

            if(procentaje>=100)
              {
                return this.colorScale[3]; 
              }
   }


   onHover(): void {
    this.progressValue = 0; 
    let progressBar: HTMLElement | null  = document.getElementById(this.idpbc); 
    let speed = 20;
    
    let progress = setInterval(() => {
      this.progressValue++;
      if(this.progressValue>this.progressEndValue){ this.progressValue = this.progressEndValue; }
      progressBar!.style.background = `conic-gradient(
          ${this.color1} ${this.progressValue * 3.6}deg,
          ${this.color2} ${this.progressValue * 3.6}deg ${this.cumplimientoesp * 3.6}deg,
          #575658 0deg 360deg
      )`;
      if (this.progressValue >= this.progressEndValue) {
        clearInterval(progress);
      }
    }, speed);
  }


}
