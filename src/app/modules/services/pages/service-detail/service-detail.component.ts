import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CONFIG } from 'src/app/config/config';
import { ApiService } from 'src/app/core/services/api.service';
import { CarService } from 'src/app/core/services/car.service';
import { Descuento } from 'src/app/shared/models/Descuento.model';
import { Producto } from 'src/app/shared/models/Producto.model';
import { Servicio } from 'src/app/shared/models/Servicio.model';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
})
export class ServiceDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _route: ActivatedRoute,
    private _car: CarService,
    private _api: ApiService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  private onDestroy = new Subject<any>();

  public quantityControl = new FormControl(1, []);

  public coupon: Descuento = {};

  private id = undefined;

  public servicio: Servicio = {};
  public image = CONFIG.NOT_FOUND_IMAGE;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getService();
    });
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  setQuantityControl() {
    this.quantityControl.setValidators([
      Validators.min(1),
    ]);
    this.quantityControl.disable();
  }

  getService() {
    let filters = { id: this.id };
    this._api.Servicios.getAdvanced({ filters: JSON.stringify(filters) })
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res: any) => {
        this.servicio = res && res.length > 0 ? res[0] || {} : {};
        this.servicio.descripcion = JSON.parse(this.servicio.descripcion);

        this.setQuantityControl();
        let image =
          this.servicio.archivos?.find((archivo) => archivo.esPrincipal)
            ?.uuid || '';
        this.image = image;
      });
  }

  addQty() {
    this.quantityControl.setValue(this.quantityControl.value + 1);
  }

  subQty() {
    if (this.quantityControl.value <= 1) {
      return;
    }
    this.quantityControl.setValue(this.quantityControl.value - 1);
  }

  buy(){
    if(this.addCar())this._router.navigate(['/checkout'])
  }

  addCar() {
    if (this.quantityControl.invalid) {
      return;
    }
    let item = this._car.Item.find(this.servicio.id || -1, 'service');

    let qty = (item?.quantity || 0) + this.quantityControl.value;

    let image =
      this.servicio.archivos?.find((archivo) => archivo.esPrincipal)?.uuid ||
      '';
    return this._car.Item.update(
      {
        id: this.servicio.id || -1,
        name: this.servicio.nombre || '',
        price: this.servicio.precio || 0,
        info: this.servicio.descripcion || '',
        quantity: qty,
        img: image,
        type: 'service',
      },
      'service'
    );
  }
  get realPrice() {
    if (!this.servicio.descuento) return this.servicio.precio;
    return (
      (this.servicio.precio || 0) -
      (this.servicio.precio || 0) * this.servicio.descuento
    );
  }
}
