import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdfpreview',
  standalone: true,
  imports: [],
  templateUrl: './Pdfpreview.component.html',
})
export default class PdfpreviewComponent implements OnInit {
public texto:string = ""; 
constructor(private route: ActivatedRoute) 
{
  setTimeout(() => {
    this.getdata()
  }, 1000);
}
  ngOnInit(): void 
  {
    
   }

   getdata()
   {
    this.texto = this.route.snapshot.paramMap.get('texto') || ''; // Obtiene el parámetro
    document.getElementById("pdfcont")!.innerHTML = this.texto;
    window.print(); 
   }

}
