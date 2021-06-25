import { CategoriaProducto } from './CategoriaProducto.model';

export interface SubCategoriaProducto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  status?: string;
  categoriaProducto?: CategoriaProducto;
}
