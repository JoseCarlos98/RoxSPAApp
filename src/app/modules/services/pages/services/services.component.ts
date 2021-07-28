import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { CategoriaServicio } from 'src/app/shared/models/CategoriaServicio.model';
import { Servicio } from 'src/app/shared/models/Servicio.model';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: ApiService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location
  ) {}
  @ViewChild('seccionServicios') seccionServicios!: ElementRef<HTMLElement>;

  private onDestroy = new Subject<any>();

  public servicios: Servicio[] = [];
  public counts: any;
  public categorias: CategoriaServicio[] = [];
  public routes: string[] = [];
  public page: number = 1;
  public pages: boolean[] = [];
  public itemsPerPage: number = 15;
  public categoria: number = 0;
  public area = '';

  public mainCategoria: CategoriaServicio = {};
  ngOnInit(): void {
    let route = this._router.url.split('/');
    this.area = route[route.length - 1];
    this.getServiciosRandom();
    this.getCategorias();
    this._route.queryParams
      .pipe(takeUntil(this.onDestroy))
      .subscribe((params) => {
        this.onParamsChange(params);
      });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  onParamsChange(params: any) {
    this.mainCategoria = {};
    this.page = Number(params.page) || 1;
    this.categoria = Number(params.categoria) || 0;
    this.mainCategoria =
      this.categorias.find((categoria) => this.categoria === categoria.id) ||
      {};
    if (this.categoria) {
      this.getServicios(this.page);
    } else {
      this.getServiciosRandom();
    }
  }

  getServiciosRandom() {
    let params: any = { limit: this.itemsPerPage };
    let parametros: any = {};
    if (this.area) {
      parametros.area = this.area;
    }
    params = JSON.stringify(params);
    parametros.parametros = params;
    this._api.Servicios.getServiciosRandom(parametros)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.servicios = res;
        this.getPages();
      });
  }

  getServicios(page: number) {
    let parametros = {
      filters: JSON.stringify({
        where: { status: 'activo', categoria: this.categoria },
        limit: this.itemsPerPage,
        skip: (page - 1) * this.itemsPerPage,
        sort: 'createdAt ASC',
      }),
    };

    this._api.Servicios.getAdvanced(parametros)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.servicios = res;
        this.getPages();
      });
  }

  getCategorias() {
    let params: any = {};
    if (this.area) {
      params.filter = JSON.stringify({ area: this.area });
    }
    this._api.Categorias.Servicios.getAll(params)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: any) => {
        this.categorias = data.categorias;
        this.counts = data.counts;
      });
  }
  getPages() {
    if (!this.counts) return;
    let pages = this.counts[this.mainCategoria.id || 0] / this.itemsPerPage;
    this.pages = Array(pages ? Math.ceil(pages) : 0).fill(true);
  }

  removeSearch() {
    let queryParams = { categoria: 0 };
    let urlTree = this._router.createUrlTree([], { queryParams });
    this._location.go(urlTree.toString());
    this.onParamsChange(queryParams);
    this.moveTo();
  }
  search(categoriaId?: number) {
    let queryParams: any = {
      page: this.page.toString(),
    };
    if (categoriaId) queryParams.categoria = categoriaId;
    let urlTree = this._router.createUrlTree([], { queryParams });
    this._location.go(urlTree.toString());
    this.onParamsChange(queryParams);
    this.moveTo();
  }
  moveTo() {
    window.scrollTo({
      top: this.seccionServicios.nativeElement.offsetTop - 140,
      behavior: 'smooth',
    });
  }
}
