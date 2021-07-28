import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'src/app/core/services/car.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor(
    private _car: CarService,
    private _router: Router,
    private _location: Location
  ) {}
  public data: any;
  public amount: number = 0;
  ngOnInit(): void {
    let state: any = this._location.getState();
    this.data = state.data;
    console.log(this.data);
    if (!this.data) {
      this._location.back();
    }
    if (this.data.amount) this.amount = Number(this.data.amount) / 100;
    if (this.data.purchase_units)
      this.amount =
        Number(this.data.purchase_units[0].payments.captures[0].amount.value);
    this._car.Car.delete();
    this._car.Coupon.update({});
  }
}
