import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'src/app/core/services/car.service';
import { Producto } from '../../models/Producto.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private _car: CarService, private _router: Router) {}

  @Input('producto') public producto: Producto = {};

  public get precio() {
    return (this.producto.precio || 0) / ((this.producto.descuento || 1) + 1);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  addCar() {
    let item = this._car.Item.find(this.producto.id || -1);
    let qty = item?.quantity || 0;
    this._car.Item.update({
      id: this.producto.id || -1,
      quantity: ++qty,
      price: this.producto.precio || -1,
      discount: this.producto.descuento,
      name: this.producto.nombre || '',
    });
  }

  goProduct() {
    this._router.navigate([`/products/${this.producto.id}`]);
  }
}
