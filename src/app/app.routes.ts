import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () => import('./main/main.component'),
    children: [
      {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('./main/pages/Home/Home.component'),
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
      },
      {
        path: 'metas',
        title: 'Metas',
        loadComponent: () => import('./main/pages/Metas/Metas.component'),
      },
      {
        path: 'config',
        title: 'Configuración',
        loadComponent: () =>
          import('./main/pages/Configuracion/Configuracion.component'),
      },
      {
        path: 'ayc-data',
        title: 'AYC',
        loadComponent: () => import('./main/pages/AYC/AYC.component'),
      },
      {
        path: 'tiempos',
        title: 'Tiempos',
        loadComponent: () => import('./main/pages/Tiempos/Tiempos.component'),
      },
      {
        path: 'ventas-bebidas',
        title: 'Ventas bebidas',
        loadComponent: () =>
          import('./main/pages/VentasBebidas/VentasBebidas.component'),
      },
      {
        path: 'mix-ventas',
        title: 'Mix de ventas',
        loadComponent: () =>
          import('./main/pages/MixDeVenta/MixDeVenta.component'),
      },
      {
        path: 'diferencias',
        title: 'Diferencias',
        loadComponent: () =>
          import('./main/pages/Diferencias/Diferencias.component'),
      },
      {
        path: '25pts',
        title: '25 Pts',
        loadComponent: () => import('./main/pages/It25pts/It25pts.component'),
      },
      {
        path: '',
        redirectTo: '/main/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./auth/login/login.component'),
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'pdfpreview/:texto',
    title: 'Dashboard supervisores',
    loadComponent: () => import('./pages/Pdfpreview/Pdfpreview.component'),
  },
];
