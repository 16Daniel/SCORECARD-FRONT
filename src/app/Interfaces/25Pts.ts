export interface It25pts {
    id: number;
    fechaini: string; // o Date si decides convertir la fecha
    sucursal: string;
    sala: number;
    mesa: number;
    totalAyc: number;
    cobros:number;
    cobrosMinimos: number;
    diferencia: number;
    justificacion: string;
    usuario: string;
    vendedor: string;
    numsemana: number; 
  }

  export interface It25ptsSuc
  {
    idf:number;
    nombresuc:string; 
    numsemana:number; 
    incidencias:number; 
    totalayc:number; 
  }

  export interface generaldata25ptssuc
  {
    semanas:number[]; 
    data:It25ptsSuc[];
  }