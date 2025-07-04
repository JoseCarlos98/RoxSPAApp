import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CONFIG } from 'src/app/config/config';
import { Descuento } from 'src/app/shared/models/Descuento.model';
import { CarItem, CarService } from '../services/car.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private _car: CarService, private _router: Router) {}

  private onDestroy = new Subject<any>();
  public selectedRoute = '';
  public showCar = false;
  public car: CarItem[] = [];
  public cupon?: Descuento;
  public get totals() {
    return this._car.Car.totals();
  }
  public get descuento() {
    return this.cupon?.porcentaje;
  }
  ngOnInit(): void {
    this._router.events.subscribe((event: any) => {
      this.selectedRoute = event ? event.anchor || '' : '';
    });
    this._car.car$.pipe(takeUntil(this.onDestroy)).subscribe((value) => {
      this.car = value;
    });
    this._car.coupon$.pipe(takeUntil(this.onDestroy)).subscribe((value) => {
      this.cupon = value;
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  public removeCarItem(item: CarItem) {
    this._car.Item.remove(item.id, item.type);
  }

  scroll(ele: HTMLElement) {
    ele.scrollIntoView({ behavior: 'smooth' });
  }

  getProductoImage(carItem: CarItem) {
    let route = `${CONFIG.IMAGES_PRODUCTOS}/${carItem.img}`;
    if (!carItem.img) {
      route = CONFIG.NOT_FOUND_IMAGE;
    }
    return route;
  }
  getRealPrice(item: CarItem) {
    if (!item.discount) return item.price;
    let discount = item.discount * item.price;
    return item.price - discount;
  }
  scrollContacto() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }
  getRoute(type: string, id: number) {
    let route = `/${type}s/${id}`;
    if (type === 'service') route = `/${type}s/detail/${id}`;
    return route;
  }
}
