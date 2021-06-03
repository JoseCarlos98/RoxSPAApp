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

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(private _route: ActivatedRoute, private _car: CarService) {}

  private onDestroy = new Subject<any>();

  public quantityControl = new FormControl(1, []);

  private id = undefined;

  public producto: Producto = {};

  public get imagen() {
    return this.producto.archivos?.find((archivo) => archivo.esPrincipal) || '';
  }

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
    this.producto = {
      id: 8,
      stock: 10,
      nombre: 'Producto balin',
      descuento: 0,
      precio: 500,
      descripcion: 'producto malayon que te rejuvenece 20 años',
      archivos: [
        { uuid: 'productoDetalle.jpg', esPrincipal: true },
        { uuid: 'productoDetalle2.jpg', esPrincipal: false },
        { uuid: 'productoDetalle3.jpg', esPrincipal: false },
        { uuid: 'productoDetalle.jpg', esPrincipal: false },
        { uuid: 'productoDetalle2.jpg', esPrincipal: false },
        { uuid: 'productoDetalle3.jpg', esPrincipal: false },
        { uuid: 'productoDetalle.jpg', esPrincipal: false },
      ],
    };
    this.setQuantityControl();
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

  addCar() {
    if (!this.hasStock) {
      return;
    }
    if (this.quantityControl.invalid) {
      return;
    }
    let item = this._car.Item.find(this.producto.id || -1);

    let qty = (item?.quantity || 0) + this.quantityControl.value;
    if (
      item &&
      item?.quantity + this.quantityControl.value > (this.producto.stock || 0)
    ) {
      qty = this.producto.stock;
    }
    this._car.Item.update({
      id: this.producto.id || -1,
      name: this.producto.nombre || '',
      price: this.producto.precio || 0,
      info: this.producto.descripcion || '',
      quantity: qty,
    });
  }
}
