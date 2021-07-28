import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from 'src/app/config/config';
import { CarService } from 'src/app/core/services/car.service';
import { Producto } from '../../models/Producto.model';

enum types {
  'product',
  'service',
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _car: CarService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  @Input('producto') public producto: Producto = {};

  @Input('type') public type: keyof typeof types = 'product';

  public get precio() {
    let precio = this.producto.precio || 0;
    let descuento = (this.producto.descuento || 0) * precio;
    return precio - descuento;
  }

  get imageRoute() {
    return (
      this.producto.archivos?.find((archivo) => archivo.esPrincipal)?.uuid ||
      CONFIG.NOT_FOUND_IMAGE
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  addCar() {
    let item = this._car.Item.find(this.producto.id || -1, this.type);
    let qty = item?.quantity || 0;
    qty++;
    if (this.type === 'product' && qty > (this.producto.stock || 0)) {
      this._toastr.error(
        `Stock de "${this.producto.nombre}" excedido.`,
        'Artículo sin stock'
      );
      return;
    }
    let image =
      this.producto.archivos?.find((archivo) => archivo.esPrincipal)?.uuid ||
      '';
    this._car.Item.update(
      {
        id: this.producto.id || -1,
        quantity: qty,
        price: this.producto.precio || -1,
        discount: this.producto.descuento,
        name: this.producto.nombre || '',
        img: image,
        type: this.type,
      },
      this.type
    );
  }

  goProduct() {
    let route = `/${this.type}s/${this.producto.id}`;
    if (this.type === 'service')
      route = `/${this.type}s/detail/${this.producto.id}`;
    this._router.navigate([route]);
  }
}
