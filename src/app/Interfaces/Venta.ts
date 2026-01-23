export interface VentaMeta
{
cumplimiento:number
ids:number
meta:number
nombreSucursal:string;
ventaTotal:number;
month:number
year:number
cumplimientoesperado:number
proyeccion:number
 }

 export interface VentaMetaDoble
{
cumplimiento:number
cumplimientoS:number
ids:number
meta:number
metaS:number
nombreSucursal:string;
ventaTotal:number;
ventaTotalS:number;
month:number
year:number
cumplimientoesperado:number
proyeccion:number
proyeccionS:number
}

 export interface DetallesVenta2
{
    ids:number; 
    descuentos:number;
    mermas:number; 
    cancelaciones:number;
    invitaciones:number;
    consumoInterno:number;
 }

export interface DetallesVentas3 {
    ids: number;
    diasdelmes: number;
    diaactual:number; 
    ventareal: number;
    costopresupuestado: number;
    costoreal: number;
    comprasdelperiodo: number;
    ticketpromediopresupuestado: number;
    ticketpromedioreal: number;
    rotacionpresupuestada: number;
    rotacionreal: number;
}

export interface DetallesArt
{
    descripcion:string;
    unidades:number;
    importe:number; 
}

export interface MixVenta {
    ids: number;
    sucursal: string;
    alimentosSalon: number;
    bebidasSalon: number;
    alimentosDelivery: number;
    bebidasDelivery: number;
    alimentosPickup: number;
    bebidasPickup: number;
    semana: number;
  }