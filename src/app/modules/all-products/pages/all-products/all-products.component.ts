import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Subject } from 'rxjs';
import { count, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { CategoriaProducto } from 'src/app/shared/models/CategoriaProducto.model';
import { Producto } from 'src/app/shared/models/Producto.model';
import { SubCategoriaProducto } from 'src/app/shared/models/SubCategoriaProducto.model';
import SwiperCore from 'swiper/core';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: ApiService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location
  ) {}
  @ViewChild('seccionProductos') seccionProductos!: ElementRef<HTMLElement>;
  private onDestroy = new Subject<any>();

  public productos: Producto[] = [];
  public counts: any;
  public categorias: CategoriaProducto[] = [];
  public routes: string[] = [];
  public page: number = 1;
  public pages: boolean[] = [];
  public itemsPerPage: number = 15;
  public categoria: number = 0;

  public mainCategoria: CategoriaProducto = {};
  public mainSubCategoria: SubCategoriaProducto = {};

  ngOnInit(): void {
    this.getCategorias();
    this._route.queryParams
    .pipe(takeUntil(this.onDestroy))
    .subscribe((params) => {
      this.onParamsChange(params)
    });
  }
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
  onParamsChange(params:any){
    this.mainSubCategoria = {};
    this.mainCategoria = {};
    this.page = Number(params.page) || 1;
    this.categoria = Number(params.categoria) || 0;
    this.mainCategoria =
      this.categorias.find((categoria) =>
        categoria.subCategorias?.some((subCategoria) => {
          if (subCategoria.id === this.categoria) {
            this.mainSubCategoria = subCategoria;
            return true;
          }
          return false;
        })
      ) || {};
    if (this.categoria) {
      this.getProductos(this.page);
    } else {
      this.getProductosRandom();
    }

  }
  getProductosRandom() {
    let parametros = JSON.stringify({ limit: this.itemsPerPage });
    this._api.Productos.getProductosRandom({ parametros })
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.productos = res;
        this.getPages();
      });
  }

  getProductos(page: number) {
    let parametros = {
      filters: JSON.stringify({
        where: { status: 'activo', categoria: this.categoria },
        limit: this.itemsPerPage,
        skip: (page - 1) * this.itemsPerPage,
        sort: 'createdAt ASC',
      }),
    };
    this._api.Productos.getAdvanced(parametros)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.productos = res;
        this.getPages();
      });
  }

  getCategorias() {
    this._api.Categorias.Productos.getAll()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: any) => {
        this.categorias = data.categorias;
        console.log(this.categorias)
        this.counts = data.counts;
      });
  }
  getPages() {
    if (!this.counts) return;
    let pages = this.counts[this.mainSubCategoria.id || 0] / this.itemsPerPage;
    this.pages = Array(pages ? Math.ceil(pages) : 0).fill(true);
  }
  removeSearch() {
    let queryParams = {categoria:0}
    let urlTree = this._router.createUrlTree([],{queryParams})
    this._location.go(urlTree.toString())
    this.onParamsChange(queryParams)
    this.moveTo()

  }
  search(categoriaId?: number) {
    let queryParams: any = {
      page: this.page.toString(),
    };
    if (categoriaId) queryParams.categoria = categoriaId;
    let urlTree = this._router.createUrlTree([],{queryParams})
    this._location.go(urlTree.toString())
    this.onParamsChange(queryParams)
    this.moveTo()
  }

  moveTo(){
    window.scrollTo({top:this.seccionProductos.nativeElement.offsetTop - 140, behavior:"smooth"})
}
}
