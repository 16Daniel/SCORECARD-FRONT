import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Ruta } from './Interfaces/Ruta';
export const authGuard: CanActivateFn = (route, state) => {
  let router:Router = inject(Router);
  if(localStorage.getItem("catRutas") != null)
    {
     
      if(route.url.toString() == "inicio")
        {
          return true
        }else
        {
          let catrutas:Ruta[] = JSON.parse(localStorage.getItem("catRutas")!); 
          let filtro = catrutas.filter(x => x.ruta == "/main/"+route.url.toString());
          if(filtro.length>0)
            {
              return true;
            } else
            {
              router.navigate(["/main/inicio"]);
              return true; 
            }
        }
      
    } else
    {
      localStorage.removeItem("rwuserdata");
     localStorage.removeItem("catRutas");
     
     router.navigate(["/auth/login"]);
      return false; 
    }
};
