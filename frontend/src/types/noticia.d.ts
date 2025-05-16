export interface NoticiaBase {
  _id: string;
  titulo: string;
  resumen: string;
  foto: string;
  fuente: string;
  fecha: string;
  categoria: string;
}

export interface Noticia extends NoticiaBase {
  contenido: string;
  url: string;
  palabrasClave?: string[];
  autor?: string;
  etiquetas?: string[];
}

export interface NoticiaRelacionada extends Omit<NoticiaBase, 'resumen'> {
  // Hereda todos los campos de NoticiaBase excepto 'resumen'
}
