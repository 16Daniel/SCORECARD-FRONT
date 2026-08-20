import { VentaMeta } from "./Venta";

export interface BonoData 
{
    alcanceDeVentas:VentaMeta;
    alcanceDeVentasSalon:VentaMeta; 
    costosSucursales:Costoucursal;
    pBebidas:PBebidas;
    inicioayc:InicioAYCHDB;
    diferenciasData:PdiferenciasModel;
    mermasdata:PmermasModel;
    porcentajeTareas:number; 
    hitsventa:HitsDeVentasModel
 }

 export interface HitsDeVentasModel {
  numcomensales: number;
  numtickets: number;
  tikcetsPromedio: number;
  cervezas: number;
  destilados: number;
  bsa: number;
  ventacervezas: number;
  ventadestilados: number;
  ventabsa: number;
  porcentajeventacervezas: number;
  porcentajeventadestilados: number;
  porcentajeventabsa: number;
}

 export interface Costoucursal
 {
    ids:number; 
    compras:number;
    costo:number; 
 } 

 export interface PBebidas
 {
    ventaAlimentosSalon:number;
    ventaBebidasSalon:number;
    ventaPostres:number;
    porcentaje:number; 
 }

 export interface MatrizBono
 {
    ids:number
    sucursal:string;
    metaVenta:number;
    ventaReal:number; 
    alcance:number;
    metaSalon:number;
    ventaSalon:number; 
    alcanceSalon:number; 
    compras:number;
    costo:number; 
    ventaAlimentosSalon:number;
    ventaBebidasSalon:number;
    ventaPostres:number; 
    porcentajeBebidas:number; 
    totalayc:number;
    inicioaychdb:number; 
    porcentajehdb:number; 
    difAla:number;
    comprasAla:number; 
    pdifAla:number;
    difBoneless:number;
    comprasBoneless:number; 
    pdifBoneless:number;
    difPapa:number;  
    comprasPapa:number;
    pdifPapa:number; 
    mermasAla:number;
    pmermasAla:number; 
    mermasBoneless:number; 
    pmermasBoneless:number;
    mermasPapa:number; 
    pmermasPapa:number; 
    porcentajeTareas:number; 
    numcomensales:number; 
    numtickets: number;
    tikcetPromedio: number;
    cervezas: number;
    destilados: number;
    bsa: number;
    ventacervezas: number;
    ventadestilados: number;
    ventabsa: number;
    porcentajeventacervezas: number;
    porcentajeventadestilados: number;
    porcentajeventabsa: number;
 }

 export interface InicioAYCHDB
 {
    totalayc:number;
    inicioHDB:number; 
    porcentaje:number; 
 }

 export interface PdiferenciasModel {
   diferenciasAla: number;
   comprasAla: number;
   diferenciasBoneless: number;
   comprasBoneless: number;
   diferenciasPapa: number;
   comprasPapa: number;
   pdifAla: number;
   pdifBoneless: number;
   pdifPapas: number;
 }

 export interface PmermasModel {
   mermasAla: number;
   mermasBoneless: number;
   mermasPapa: number;
   pmermasAla: number;
   pmermasBoneless: number;
   pmermasPapas: number;
 }