import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { ApiService } from './api.service';
import { Producto } from 'src/app/shared/models/Producto.model';
import { Descuento } from 'src/app/shared/models/Descuento.model';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from 'src/app/shared/models/Servicio.model';

enum types {
  'product',
  'service',
}

export type CarItem = {
  id: number;
  quantity: number;
  name: string;
  price: number;
  discount?: number;
  info?: string;
  img?: string;
  type: keyof typeof types;
};

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor(private _api: ApiService, private _toastr: ToastrService) {
    this.Car.verify();
    this.Coupon.verify();
  }
  private CAR_KEY = 'Y2Fycml0bw==';
  private COUPON_KEY = 'bWVyY2Fkb3RlY25pYQ==';
  private SECRET_KEY = 'Y2Fycml0bw==';
  public car$ = new BehaviorSubject<CarItem[]>([]);
  public coupon$ = new BehaviorSubject<Descuento>({});
  public Coupon = {
    get: () => {
      try {
        let coupon: Descuento = JSON.parse(
          localStorage.getItem(this.COUPON_KEY) || ''
        );
        return coupon;
      } catch (error) {
        this.coupon$.next({});
        return {};
      }
    },
    update: (discount: Descuento) => {
      try {
        localStorage.setItem(this.COUPON_KEY, JSON.stringify(discount));
        this.coupon$.next(discount);
        return discount;
      } catch (error) {
        this.coupon$.next({});
        return undefined;
      }
    },
    verify: (updated?: boolean) => {
      let coupon = this.Coupon.get();
      if (!coupon || Object.keys(coupon).length <= 0) return;
      this._api.Descuentos.verificar({ codigo: coupon.codigo }).subscribe(
        (discount:any) => {
          if (!discount || !discount.valido) {
            discount = {};
            this._toastr.error(
              `El cupón "${coupon.codigo}" ha expirado o no existe.`,
              'Error en cupón'
            );
          } else {
            if (updated)
              this._toastr.success(
                `El cupón "${coupon.codigo}" se ha aplicado exitosamente.`,
                'Cupón Aplicado'
              );
          }
          this.Coupon.update(discount);
        },
        () => {
          this._toastr.error(
            `No se pudo verificar su cupón ${coupon.codigo}, verifique su conexión.`
          );
        }
      );
    },
  };
  public Item = {
    find: (id: number, type: keyof typeof types) => {
      try {
        return this.car$.value.find(
          (item) => item.id === id && item.type === type
        );
      } catch (error) {
        return undefined;
      }
    },
    add: (item: CarItem) => {
      try {
        let car = this.Car.get();
        car.push(item);
        this.Car.update(car);
        return car;
      } catch (error) {
        return undefined;
      }
    },
    update: (item: CarItem, type: keyof typeof types) => {
      try {
        let car = this.Car.get();
        let foundedItem = car.findIndex(
          (fItem) => item.id === fItem.id && fItem.type === type
        );
        if (foundedItem === -1) {
          car.push(item);
        } else {
          car[foundedItem] = item;
        }

        this.Car.update(car);
        return car;
      } catch (error) {
        return undefined;
      }
    },
    remove: (itemId: number, type: keyof typeof types) => {
      try {
        let car = this.Car.get();
        let foundedItem = car.findIndex(
          (fItem) => itemId === fItem.id && fItem.type === type
        );
        if (foundedItem !== -1) {
          car.splice(foundedItem, 1);
        }
        this.Car.update(car);
        return car;
      } catch (error) {
        return undefined;
      }
    },
  };

  public Car = {
    totals: () => {
      let car = this.Car.get();
      let quantity = car.reduce((acc, ele) => acc + ele.quantity || 0, 0);
      let subtotal = car.reduce(
        (acc, ele) => acc + ele.price * ele.quantity,
        0
      );
      let discount = car.reduce(
        (acc, ele) => acc + ele.price * (ele.discount || 0) * ele.quantity,
        0
      );
      let cupon = (this.Coupon.get().porcentaje || 0) / 100;
      let total = subtotal - discount;
      let coupon = total * cupon;
      total -= coupon;
      return {
        quantity,
        coupon,
        subtotal,
        discount,
        total,
      };
    },

    get: (): CarItem[] => {
      try {
        let ls: string = localStorage.getItem(this.CAR_KEY) || '';
        return JSON.parse(
          CryptoJS.AES.decrypt(ls, this.SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );
      } catch (error) {
        this.Car.update([]);
        return [];
      }
    },
    update: (car: CarItem[]) => {
      try {
        this.car$.next(car || []);
        let data = CryptoJS.AES.encrypt(
          JSON.stringify(car),
          this.SECRET_KEY
        ).toString();
        localStorage.setItem(this.CAR_KEY, data);
        return true;
      } catch (error) {
        return false;
      }
    },
    delete: () => {
      try {
        this.Car.update([]);
        return true;
      } catch (error) {
        return false;
      }
    },
    verify: () => {
      let car = this.Car.get();
      let ids = {
        products: car
          .filter((item) => item.type === 'product')
          .map((item) => item.id),
        services: car
          .filter((item) => item.type === 'service')
          .map((item) => item.id),
      };

      let filters = {
        products: { id: { in: ids.products } },
        services: { id: { in: ids.services } },
      };

      let newCar: CarItem[] = [];
      let productos$ = this._api.Productos.getAdvanced({
        filters: JSON.stringify(filters.products),
      });
      let servicios$ = this._api.Servicios.getAdvanced({
        filters: JSON.stringify(filters.services),
      });
      forkJoin([productos$, servicios$]).subscribe((res: any[]) => {
        let productos = res[0];
        let servicios = res[1];
        newCar = newCar.concat(this.verifyItems(productos, car, 'product'));
        newCar = newCar.concat(this.verifyItems(servicios, car, 'service'));
        this.Car.update(newCar);
      });
    },
  };

  private verifyItems(items: any[], car: CarItem[], type: keyof typeof types) {
    let newCar: CarItem[] = [];
    car = car.filter((item) => item.type === type);
    items.forEach((item: Producto) => {
      let itemFound = car.find((carItem) => carItem.id === item.id);
      if (itemFound) {
        try {
          if (type === 'product' && !((item.stock || 0) > 0)) throw 'no stock';
          let quantity = itemFound.quantity;
          if (type === 'product')
            quantity =
              quantity > (item.stock || 0) ? item.stock || 0 : quantity;
          newCar.push({
            id: item.id || 0,
            name: item.nombre || '',
            price: item.precio || 0,
            quantity: quantity || 0,
            discount: item.descuento,
            img: item.archivos?.find((ele) => ele.esPrincipal)?.uuid,
            info: item.descripcion,
            type: type,
          });
        } catch (error) {}
      }
    });
    return newCar;
  }
}
