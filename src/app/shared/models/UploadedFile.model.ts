import { Producto } from './Producto.model';

export interface UploadedFile {
  id?: number;
  size?: number;
  uuid?: string;
  status?: string;
  esPrincipal?: boolean;
  producto?: Producto;
}
