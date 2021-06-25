import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { Producto } from 'src/app/shared/models/Producto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private _api: ApiService, private _toastr: ToastrService) {}

  private onDestroy = new Subject<any>();

  public productos: Producto[] = [];

  ngOnInit(): void {
    this.getProductos();
  }

  ngAfterViewInit(): void {}

  getProductos() {
    let parametros = JSON.stringify({ limit: 8 });
    this._api.Productos.getProductosRandom({ parametros })
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (productos: any) => (this.productos = productos),
        (err) => this._toastr.error('Verifique su conexión', 'Sin conexión')
      );
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
