import {
  OnInit,
  Component,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Producto } from 'src/app/shared/models/Producto.model';
import { FormControl, Validators } from '@angular/forms';
import { CarService } from 'src/app/core/services/car.service';
import { ApiService } from 'src/app/core/services/api.service';
import { takeUntil } from 'rxjs/operators';
import { CONFIG } from 'src/app/config/config';
import { Descuento } from 'src/app/shared/models/Descuento.model';
import { ToastrService } from 'ngx-toastr';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _route: ActivatedRoute,
    private _car: CarService,
    private _api: ApiService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  private onDestroy = new Subject<any>();

  public quantityControl = new FormControl(1, []);

  public coupon: Descuento = {};

  private id = undefined;

  public producto: Producto = {};
  public image = CONFIG.NOT_FOUND_IMAGE;
  public get hasStock() {
    return (this.producto.stock || 0) > 0;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getProduct();
    });
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  setQuantityControl() {
    this.quantityControl.setValidators([
      Validators.max(this.producto.stock || 0),
      Validators.min(1),
    ]);
    this.quantityControl.disable();
    if (!this.hasStock) this.quantityControl.setValue(0);
  }

  getProduct() {
    let filters = { id: this.id };
    this._api.Productos.getAdvanced({ filters: JSON.stringify(filters) })
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.producto = res && res.length > 0 ? res[0] || {} : {};
        this.producto.descripcion = JSON.parse(this.producto.descripcion);
        this.setQuantityControl();
        let image =
          this.producto.archivos?.find((archivo) => archivo.esPrincipal)
            ?.uuid || '';
        this.image = image;
      });
  }

  addQty() {
    if (!this.hasStock) {
      return;
    }
    if (this.quantityControl.value >= (this.producto.stock || 0)) {
      return;
    }
    this.quantityControl.setValue(this.quantityControl.value + 1);
  }

  subQty() {
    if (!this.hasStock) {
      return;
    }
    if (this.quantityControl.value <= 1) {
      return;
    }
    this.quantityControl.setValue(this.quantityControl.value - 1);
  }

  buy() {
    if (this.addCar()) this._router.navigate(['/checkout']);
  }

  addCar() {
    if (!this.hasStock) {
      this._toastr.error(
        `El artículo "${this.producto.nombre}}" no tiene stock suficiente.`,
        'Sin stock.'
      );
      return;
    }
    if (this.quantityControl.invalid) {
      return;
    }
    let item = this._car.Item.find(this.producto.id || -1, 'product');

    let qty = (item?.quantity || 0) + this.quantityControl.value;
    if (
      item &&
      item?.quantity + this.quantityControl.value > (this.producto.stock || 0)
    ) {
      this._toastr.warning(
        `El artículo "${this.producto.nombre}" sobrepasó el stock, Se a agregado su límite a su carrito.`,
        'Exceso sobre stock.'
      );
      qty = this.producto.stock;
    }
    let image =
      this.producto.archivos?.find((archivo) => archivo.esPrincipal)?.uuid ||
      '';
    return this._car.Item.update(
      {
        id: this.producto.id || -1,
        name: this.producto.nombre || '',
        price: this.producto.precio || 0,
        info: this.producto.descripcion || '',
        quantity: qty,
        img: image,
        type: 'product',
      },
      'product'
    );
  }
  get realPrice() {
    if (!this.producto.descuento) return this.producto.precio;
    return (
      (this.producto.precio || 0) -
      (this.producto.precio || 0) * this.producto.descuento
    );
  }
}
