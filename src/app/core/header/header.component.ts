import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  public get totals() {
    let price = this.car.reduce(
      (acc, ele) => acc + (ele.price || 0) * (ele.quantity || 0),
      0
    );
    let discount = this.car.reduce(
      (acc, ele) =>
        acc + ele.price * ((ele.discount || 0) * (ele.quantity || 0)),
      0
    );
    let quantity = this.car.reduce((acc, ele) => acc + (ele.quantity || 0), 0);
    let total = price - discount;
    return {
      price,
      discount,
      quantity,
      total,
    };
  }

  ngOnInit(): void {
    this._router.events.subscribe((event: any) => {
      this.selectedRoute = event  ? event.anchor || '' : '';
    });
    this._car.car$.pipe(takeUntil(this.onDestroy)).subscribe((value) => {
      this.car = value;
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  public removeCarItem(item: CarItem) {
    this._car.Item.remove(item.id);
  }

  scroll(ele: HTMLElement) {
    ele.scrollIntoView({ behavior: 'smooth' });
  }
}
