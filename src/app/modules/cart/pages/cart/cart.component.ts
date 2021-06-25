import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CONFIG } from 'src/app/config/config';
import { ApiService } from 'src/app/core/services/api.service';
import { CarItem, CarService } from 'src/app/core/services/car.service';
import { Descuento } from 'src/app/shared/models/Descuento.model';
import { Producto } from 'src/app/shared/models/Producto.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private _api: ApiService, private _car: CarService) {}

  private onDestroy = new Subject<any>();

  public productos: Producto[] = [];
  public car: CarItem[] = [];

  public coupon?: Descuento;
  public couponControl = new FormControl('');
  public get totals() {
    return this._car.Car.totals();
  }

  ngOnInit(): void {
    this._car.Car.verify();
    this._car.car$.pipe(takeUntil(this.onDestroy)).subscribe((value) => {
      this.car = value;
      this.getProductos();
    });
    this._car.Coupon.verify();
    this._car.coupon$.pipe(takeUntil(this.onDestroy)).subscribe((descuento) => {
      this.coupon = descuento;
      this.couponControl.setValue(this.coupon?.codigo);
    });
  }

  ngAfterViewInit(): void {}
  changeCoupon() {
    this._car.Coupon.update({ codigo: this.couponControl.value });
    this._car.Coupon.verify(true);
  }
  getProductos() {
    let ids = this.car.map((carItem) => carItem.id);
    let filters = { id: { in: ids } };
    this._api.Productos.getAdvanced({ filters: JSON.stringify(filters) })
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.productos = res;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  getProductoImage(uuid: string) {
    let route = `${CONFIG.IMAGES_PRODUCTOS}/${uuid}`;
    if (!uuid) {
      route = CONFIG.NOT_FOUND_IMAGE;
    }
    return route;
  }

  getRealPrice(carItem: CarItem) {
    return (carItem.price || 0) / ((carItem.discount || 0) + 1);
  }

  addQty(carItem: CarItem) {
    let founded = this.verifyProduct(carItem.id || -1);
    if (founded <= -1) {
      return;
    }
    let producto = this.productos[founded];
    if ((producto.stock || 0) <= 0) {
      return;
    }
    if (carItem.quantity + 1 > (producto.stock || 0)) {
      return;
    }
    carItem.quantity++;
    this._car.Item.update(carItem);
  }

  subQty(carItem: CarItem) {
    let founded = this.verifyProduct(carItem.id || -1);
    if (founded <= -1) {
      return;
    }
    let producto = this.productos[founded];
    if ((producto.stock || 0) <= 0) {
      return;
    }
    if (carItem.quantity - 1 <= 0) {
      return;
    }
    carItem.quantity--;
    this._car.Item.update(carItem);
  }

  removeItem(carItem: CarItem) {
    this._car.Item.remove(carItem.id);
  }

  verifyProduct(id: number) {
    let found = this.productos.findIndex((ele) => id === ele.id);
    return found;
  }
}
