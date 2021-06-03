import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

export type CarItem = {
  id: number;
  quantity: number;
  name: string;
  price: number;
  discount?: number;
  info?: string;
  img?: string;
};

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor() {
    this.car$.next(this.Car.get());
  }
  private CAR_KEY = 'Y2Fycml0bw==';
  private SECRET_KEY = 'Y2Fycml0bw==';
  public car$ = new BehaviorSubject<CarItem[]>([]);

  public Item = {
    find: (id: number) => {
      try {
        return this.car$.value.find((item) => item.id === id);
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
    update: (item: CarItem) => {
      try {
        let car = this.Car.get();
        let foundedItem = car.findIndex((fItem) => (item.id === fItem.id));
        console.log(foundedItem)
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
    remove: (itemId: number) => {
      try {
        let car = this.Car.get();
        let foundedItem = car.findIndex((fItem) => (itemId === fItem.id));
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
  };
}
