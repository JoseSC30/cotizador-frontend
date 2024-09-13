export interface PresupuestoData {
  detalles_proyecto:       DetallesProyecto[];
  materiales_construccion: Instalacione[];
  instalaciones:           Instalacione[];
  mano_de_obra_requerida:  ManoDeObraRequerida[];
  costos_estimados:        CostosEstimados;
  total_final:             number;
  nota:                    string;
}

export interface CostosEstimados {
  materiales:    number;
  mano_de_obra:  number;
  instalaciones: number;
}

export interface DetallesProyecto {
  nombre:      string;
  dimensiones: Dimensiones;
}

export interface Dimensiones {
  ancho: string;
  largo: string;
  alto:  string;
}

export interface Instalacione {
  nombre:          string;
  cantidad:        number;
  precio_unitario: number;
  total:           number;
}

export interface ManoDeObraRequerida {
  nombre:     string;
  dias:       number;
  precio_dia: number;
  total:      number;
}
