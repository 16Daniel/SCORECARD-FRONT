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

}
