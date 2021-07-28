import { CategoriaServicio } from './CategoriaServicio.model';
import { UploadedFile } from './UploadedFile.model';

export interface Servicio {
  id?: number;
  nombre?: string;
  precio?: number;
  descripcion?: any;
  descripcionCorta?: any;
  descuento?: number;
  status?: string;
  archivos?: UploadedFile[];
  categoria?: CategoriaServicio;
}
