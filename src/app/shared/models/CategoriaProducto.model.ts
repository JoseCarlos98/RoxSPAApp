import { SubCategoriaProducto } from './SubCategoriaProducto.model';

export interface CategoriaProducto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  status?: string;
  subCategorias?: SubCategoriaProducto[];
}
