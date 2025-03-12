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
import { PanelMenuModule } from 'primeng/panelmenu';
import { UsuarioLogin } from '../../Interfaces/Usuario';
import { Rol } from '../../Interfaces/Rol';
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
    MenubarModule,
    PanelMenuModule
  ],
  templateUrl: './SideMenu.component.html',
  styleUrl: './SideMenu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {
public items:MenuItem[] = []; 
  public contador:number = 1;
  public showmenu:boolean = false; 
  public userdata:UsuarioLogin|undefined;
  public catroles:Rol[] = [{id:1,descripcion:'DIRECCIÓN'},{id:2,descripcion:'REGIONAL'},{id:3,descripcion:'SUPERVISOR'},{id:4,descripcion:'ADMINISTRADOR'}];

  constructor(public cdr:ChangeDetectorRef,private router: Router,public apiserv:ApiService)
  {
    let jsondata:string|null = localStorage.getItem("rwuserdataDash");
    this.userdata = JSON.parse(jsondata!);
  }

  ngOnInit(): void 
  {
    this.items = [
      {
        label: 'Inicio',
        icon: 'bx bx-home-alt bx-sm',
        command: () => {
            this.router.navigate(['main/inicio']);
            this.closemenu(); 
        }
      },
      {
        label: 'CALIDAD',
        icon: 'bx bxs-star bx-sm',
        items: [
            {
                label: 'Mermas',
                icon: 'bx bx-trash-alt',
                route: '/main/mermas'
            }
        ]
    },
    {
        label: 'EFICIENCIA OPERATIVA',
        icon: 'bx bxs-bar-chart-alt-2 bx-sm',
        items: [
          {
              label: '% Bebidas',
              icon: 'bx bx-beer',
              route: '/main/ventas-bebidas'
          },
          {
            label: 'Mix de ventas',
            icon: 'bx bx-money-withdraw',
            route: '/main/mix-ventas'
        },
        {
          label: 'Inicio AYC',
          icon: 'bx bx-infinite',
          route: '/main/ayc-data'
        },
        {
          label: '25 puntos',
          icon: 'bx bx-food-menu',
          route: '/installation'
          },
          {
            label: 'Diferencias',
            icon: 'bx bx-expand-horizontal',
            route: '/main/diferencias'
            },
            
          {
            label: 'Tiempos',
            icon: 'bx bx-timer',
            route: '/main/tiempos'
            },
      ]
    },
    {
      label: 'DESARROLLO HUMANO',
      icon: 'bx bx-group bx-sm',
      items: [
        {
            label: 'Rotación',
            icon: 'bx bx-trash-alt',
            route: '/installation'
        }
    ]
  },
  {
    label: 'FINACIERO',
    icon: 'bx bx-dollar-circle',
    items: [
      {
          label: 'Ventas',
          icon: 'bx bx-money',
          route: '/main/home'
      },
      {
        label: 'Costo',
        icon: 'bx bx-trash-alt',
        route: '/installation'
    }
  ]
},
{
  label: 'SEGURIDAD',
  icon: 'bx bx-shield bx-sm',
  command: () => {
      this.router.navigate(['/']);
  }
},
{
label: 'SCORECARD',
icon: 'bx bxs-dashboard bx-sm',
command: () => {
    this.router.navigate(['main/25pts']);
}
},
{
label: 'REGIONALES',
icon: 'bx bxs-report bx-sm',
items: [
  {
      label: 'Tendencia 25 puntos',
      icon: 'bx bx-trash-alt',
      route: '/main/ev25pts-sucursales'
  },
]
},
{
  label: 'Reporte Bonos',
  icon: 'bx bxs-report bx-sm',
  route: '/main/reporte-bonos'
  },
];

   }

   logout()
   {
    localStorage.removeItem("rwuserdataDash");
     this.router.navigate(["/auth/login"]);
   }

   closemenu()
   {
    this.showmenu = false; 
   }

   getrolname(idr:number):string
{
  let name = "";
  let rol = this.catroles.filter(x => x.id == idr);
  if(rol.length>0)
    {
      name = rol[0].descripcion;
    }
 return name; 
}
}
