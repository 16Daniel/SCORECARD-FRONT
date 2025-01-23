import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from 'primeng/api'
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ApiService } from '../../Services/api.service';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    MenuModule,
    SidebarModule,
    FormsModule,
    OverlayPanelModule,
    MessagesModule,
    DialogModule,
    MenubarModule
  ],
  templateUrl: './SideMenu.component.html',
  styleUrl: './SideMenu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {
public items:MenuItem[] = []; 
  public contador:number = 1;
  public showmenu:boolean = false; 

  constructor(public cdr:ChangeDetectorRef,private router: Router,public apiserv:ApiService)
  {
      let jsondata:string|null = localStorage.getItem("rwuserdata");
  }

  ngOnInit(): void 
  {
    this.items = [
      {
          label: 'Inicio',
          icon: 'pi pi-home',
          route: '/home'
      },
      {
          label: 'Metas',
          icon: 'pi pi-bullseye',
           route: '/metas'
      },
  ];
   }

   logout()
   {
     
     this.router.navigate(["/auth/login"]);
   }

   closemenu()
   {
    this.showmenu = false; 
   }

}
