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
  ngOnInit(): void {
    let state: any = this._location.getState();
    this.data = state.data;
    console.log(this.data);
    if (!this.data) {
      this._location.back();
    }
    this._car.Car.delete();
    this._car.Coupon.update({});
  }
}
