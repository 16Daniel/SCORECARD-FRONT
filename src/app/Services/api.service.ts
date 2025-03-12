import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError, timeout } from "rxjs";
import { environment } from '../../environments/enviroments';
import { Sucursal } from '../Interfaces/Sucursal';
import { DetallesArt, DetallesVentas3, MixVenta } from '../Interfaces/Venta';
import { InicioAYC } from '../Interfaces/InicioAYC.';
import { TiemposSuc } from '../Interfaces/Tiempos.';
import { VentaBebida } from '../Interfaces/VentaBebida.';
import { Diferencia } from '../Interfaces/Diferencia';
import { It25pts } from '../Interfaces/25Pts';
import { Usuario, UsuarioLogin } from '../Interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL to web api
  public apiURL = environment.apiURL;
  // URL api server
  private url: string = environment.apiURL;
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) 
  {
    this.headers.append("Accept", "application/json");
    this.headers.append("content-type", "application/json");
   }


   leerExcel(paramfile:File):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("file",paramfile);
    return this.http.post<any>(this.url+'Metas/upload',formdata,{headers:this.headers})
   }

   descargarmachote(fecha:string):Observable<any>
   {
    return this.http.get(this.url+`Metas/descargarMachote/${fecha}`,{headers:this.headers})
   }

   cargarMetas(data:string):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("jdata",data);
    return this.http.post<any>(this.url+'Metas/GuardarMetas',formdata,{headers:this.headers})
   }

   getSucursales():Observable<Sucursal[]>
   {
      return this.http.get<Sucursal[]>(this.url+'Catalogos/getSucursales',{headers:this.headers})
   }

   getDash(fecha:string, jdata:string):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("jdsucursales",jdata);
    formdata.append("fecha",fecha);
    return this.http.post<any>(this.url+'Dashboard/ConsultaDashboard',formdata,{headers:this.headers})
   }

   getDashMeses(fechas:string, jdata:string):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("jdsucursales",jdata);
    formdata.append("fechas",fechas);
    return this.http.post<any>(this.url+'Dashboard/ConsultaDashboardMeses',formdata,{headers:this.headers})
   }

   getDetallesVentas(ids:number, fecha:string):Observable<any>
   {
    return this.http.get<any>(this.url+`Dashboard/DetallesVentas/${ids}/${fecha}`,{headers:this.headers})
   }

   getDetallesVentas2(ids:number, fecha:string):Observable<any>
   {
    return this.http.get<any>(this.url+`Dashboard/DetallesVentas2/${ids}/${fecha}`,{headers:this.headers})
   }

   getDetallesVentas3(ids:number, fecha:string):Observable<DetallesVentas3>
   {
    return this.http.get<DetallesVentas3>(this.url+`Dashboard/DetallesVentas3/${ids}/${fecha}`,{headers:this.headers})
   }

   
   getparametros():Observable<any>
   {
    return this.http.get<any>(this.url+`Parametros/getData`,{headers:this.headers})
   }

   saveParametros(jdata:string):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("jdatap",jdata);
    return this.http.post<any>(this.url+'Parametros/saveData',formdata,{headers:this.headers})
   }


   getDetallesDescuentos(ids:number, fecha:string):Observable<DetallesArt[]>
   {
    return this.http.get<DetallesArt[]>(this.url+`Dashboard/DetallesDescuentos/${ids}/${fecha}`,{headers:this.headers})
   }

   getDetallesMermas(ids:number, fecha:string):Observable<DetallesArt[]>
   {
    return this.http.get<DetallesArt[]>(this.url+`Dashboard/DetallesMermas/${ids}/${fecha}`,{headers:this.headers})
   }

   getDetallesCancelaciones(ids:number, fecha:string):Observable<DetallesArt[]>
   {
    return this.http.get<DetallesArt[]>(this.url+`Dashboard/DetallesCancelaciones/${ids}/${fecha}`,{headers:this.headers})
   }

   getDetallesInvitaciones(ids:number, fecha:string):Observable<DetallesArt[]>
   {
    return this.http.get<DetallesArt[]>(this.url+`Dashboard/DetallesInvitaciones/${ids}/${fecha}`,{headers:this.headers})
   }

   getDetallesConsumoInterno(ids:number, fecha:string):Observable<DetallesArt[]>
   {
    return this.http.get<DetallesArt[]>(this.url+`Dashboard/DetallesConsumoInterno/${ids}/${fecha}`,{headers:this.headers})
   }

   getIniciosAYC(sucursales:string, fechaini:string, fechafin:string):Observable<InicioAYC[]>
   {
    return this.http.get<InicioAYC[]>(this.url+`Dashboard/inicioAYC/${sucursales}/${fechaini}/${fechafin}`,{headers:this.headers})
   }

   getTiempos(sucursales:string, fechaini:string, fechafin:string, promini:string, promf:string):Observable<TiemposSuc[]>
   {
    return this.http.get<TiemposSuc[]>(this.url+`Dashboard/gettiempos/${sucursales}/${fechaini}/${fechafin}/${promini}/${promf}`,{headers:this.headers})
   }

   
   ExcelTiemposPromedios(data:any, promini:string, promf:string):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("data",data);
    formdata.append("promini",promini);
    formdata.append("promf",promf);
    return this.http.post<any>(this.url+'Dashboard/getExcelTiemposPromedios',formdata,{headers:this.headers})
   }

   getVentasBebidas(sucursales:string, fechaini:string, fechafin:string):Observable<VentaBebida[]>
   {
    return this.http.get<VentaBebida[]>(this.url+`Dashboard/getVentasBebidas/${sucursales}/${fechaini}/${fechafin}`,{headers:this.headers})
   }

   getPBebidas(sucursales:string, fechaini:string, fechafin:string):Observable<VentaBebida[]>
   {
    return this.http.get<VentaBebida[]>(this.url+`Dashboard/getPBebidas/${sucursales}/${fechaini}/${fechafin}`,{headers:this.headers})
   }

   ExcelVentasBebidas(data:any):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("data",data);
    return this.http.post<any>(this.url+'Dashboard/getExcelPBebidas',formdata,{headers:this.headers})
   }


   getMixDeVentas(sucursales:string, fechaini:string, fechafin:string):Observable<MixVenta[]>
   {
    return this.http.get<MixVenta[]>(this.url+`Dashboard/getMixventas/${sucursales}/${fechaini}/${fechafin}`,{headers:this.headers})
   }

   getDiferencias(sucursales:string, fechaini:string, fechafin:string):Observable<Diferencia[]>
   {
    return this.http.get<Diferencia[]>(this.url+`Diferencias/getDiferencias/${sucursales}/${fechaini}/${fechafin}`,{headers:this.headers})
   }

   getDataDashSuc(sucursales:string, fechaini:string, fechafin:string):Observable<any[]>
   {
    return this.http.get<any[]>(this.url+`Dashboard/get25pts/${sucursales}/${fechaini}/${fechafin}`,{headers:this.headers})
   }

   getPdfSuc():Observable<any>
   {
    return this.http.get<any>(this.url+`Dashboard/getPdfSuc`,{headers:this.headers})
   }

   getusuarios():Observable<Usuario[]>
   {
      return this.http.get<Usuario[]>(this.url+`Usuarios/getusUarios`,{headers:this.headers})
   }

   createUser(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Usuarios/createUser',data,{headers:this.headers})
   }

   deleteUser(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Usuarios/deleteUser/${id}`,{headers:this.headers})
   }

   updateUser(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Usuarios/updateUser',data,{headers:this.headers})
   }

   login(data:any):Observable<UsuarioLogin>
   {
      return this.http.post<UsuarioLogin>(this.url+`Usuarios/Login`,data,{headers:this.headers})
   }

   get25ptsSucursales(sucursales:string, fechafin:string):Observable<any>
   {
    return this.http.get<any>(this.url+`Dashboard/get25ptsSucursales/${sucursales}/${fechafin}`,{headers:this.headers})
   }

   getMermas(sucursales:string, fechafin:string):Observable<any>
   {
    return this.http.get<any>(this.url+`Dashboard/getMermas/${sucursales}/${fechafin}`,{headers:this.headers})
   }

   getIniciosAYCSucursales(sucursales:string, fechafin:string):Observable<any>
   {
    return this.http.get<any>(this.url+`Dashboard/getPorcentajeInicioAYC/${sucursales}/${fechafin}`,{headers:this.headers})
   }
  
   getBonosData(sucursales:string,mes:Date):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("jdsucursales",sucursales);
    formdata.append("fecha",mes.toISOString());
    return this.http.post<any>(this.url+'Bonos/getBonosData',formdata,{headers:this.headers})
   }
}

