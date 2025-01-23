import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../Services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule
  ],
  providers:[MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
public email:string = '';
public pass:string = '';
public loading:boolean = false; 
public showpass:boolean = false;
public typei:string = 'password'; 

constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private router: Router)
{
  
  
}


showMessage(sev:string,summ:string,det:string) {
  this.messageService.add({ severity: sev, summary: summ, detail: det });
}


}
