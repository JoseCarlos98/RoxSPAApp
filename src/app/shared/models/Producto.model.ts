import { CategoriaProducto } from './CategoriaProducto.model';
import { Descuento } from './Descuento.model';
import { UploadedFile } from './UploadedFile.model';

export interface Producto {
  id?: number;
  nombre?: string;
  precio?: number;
  descripcion?: any;
  descripcionCorta?: any;
  descuento?: number;
  status?: string;
  archivos?: UploadedFile[];
  stock?: number;
  categoria?: CategoriaProducto;
}
