import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ApiService } from '../../Services/api.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    PanelMenuModule],
  templateUrl: './Inicio.component.html',
})
export default class InicioComponent implements OnInit {
public items:MenuItem[] = []; 
  constructor(public cdr:ChangeDetectorRef,private router: Router,public apiserv:ApiService)
  {
  }
  ngOnInit(): void 
  {
    this.items = [
      {
        label: 'INICIO',
        icon: 'bx bx-home-alt bx-sm',
        command: () => {
            this.router.navigate(['main/inicio']);
        }
      },
      {
        label: 'SEGURIDAD',
        icon: 'bx bx-shield bx-sm',
        command: () => {
            this.router.navigate(['/']);
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
              label: 'Venta sugestiva',
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
          route: '/inicio'
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
            route: '/inicio'
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
        route: '/inicio'
    }
  ]
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
command: () => 
  {
    this.router.navigate(['/main/ev25pts-sucursales']);
  }
},
{
  label: 'REPORTE BONOS',
  icon: 'bx bxs-report bx-sm',
  route: '/main/reporte-bonos'
  },
  {
    label: 'GRUPOS',
    icon: 'bx bxs-group bx-sm',
    route: '/main/agrupadores'
    },
    {
      label: 'USUARIOS',
      icon: 'bx bx-user bx-sm',
      route: '/main/usuarios'
      },
      {
        label: 'ROLES',
        icon: 'bx bx-objects-horizontal-left bx-sm',
        route: '/main/roles'
        },
        {
          label: 'METAS',
          icon: 'bx bx-target-lock bx-sm',
          command: () => 
            {
              this.router.navigate(['/main/metas']);
            }
          },
];

   }

}
