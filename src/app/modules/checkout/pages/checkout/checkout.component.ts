import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, of, Subject, throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

import { CarItem, CarService } from 'src/app/core/services/car.service';
import { Router } from '@angular/router';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Descuento } from 'src/app/shared/models/Descuento.model';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import {
  CreatePaymentMethodData,
  StripeCardElementOptions,
  StripeElementsOptions,
  StripeError,
  PaymentMethod,
} from '@stripe/stripe-js';

import * as Stripe from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import {
  IOnApproveCallbackActions,
  IOnApproveCallbackData,
  IPayPalConfig,
  ICreateOrderRequest,
} from 'ngx-paypal';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: ApiService,
    private _car: CarService,
    private _router: Router,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _stripe: StripeService,
    private _location: Location
  ) {}
  private onDestroy = new Subject<any>();
  @ViewChild(StripeCardComponent) payCard!: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    classes: { base: 'base-pay-card' },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  public payPalConfig?: IPayPalConfig;

  public car: CarItem[] = [];
  public items = [];
  public estadosMx = [];
  public paises = [];
  public paying: boolean = false;
  public coupon?: Descuento;
  public form = this._fb.group({
    calle: ['', Validators.required],
    ciudad: ['', Validators.required],
    codigo: [{ value: '', disabled: false }],
    correo: ['', [Validators.required, Validators.email]],
    cp: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    estado: [null, Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    numExt: [
      '',
      [
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]*$/),
      ],
    ],
    numInt: ['', Validators.maxLength(6)],
    pais: ['MEX', Validators.required],
    envio: [0],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9+]*$/)]],
    metodoPago: ['tarjeta', Validators.required],
  });
  private datosOrden: any;
  public payForm = this._fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
  });

  public couponControl = new FormControl('');

  public get totals() {
    return this._car.Car.totals();
  }

  ngOnInit() {
    if (this._car.Car.get().length <= 0) {
      this._location.back();
    }
    this._car.Car.verify();
    this._car.car$.subscribe((car) => {
      this.car = car;
      let hasProduct = car.some((item) => item.type === 'product');
      this.form.controls.envio.setValue(0);
      if (hasProduct) this.form.controls.envio.setValue(99);
      if (this._router.url === '/checkout' && !this.car.length) {
        console.log(this._router.url);
        this._router.navigateByUrl('/cart');
      }
    });
    this.getStates();
    this._car.Coupon.verify();
    this._car.coupon$.pipe(takeUntil(this.onDestroy)).subscribe((descuento) => {
      this.coupon = descuento;
      this.couponControl.setValue(this.coupon?.codigo);
    });
    this.initPayPalConfig();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  async initPayPalConfig() {
    this.payPalConfig = {
      currency: 'MXN',
      clientId: environment.payPalClientId,
      style: {
        layout:'horizontal'
      },
      createOrderOnServer: (data) =>
        this.createPayPalOrder().then((res: any) => res.id),
      onError: (error) => {
        this._toastr.error('Error realizar transacción.', 'Error de compra.');
      },
      authorizeOnServer: (data, action) =>
        this.authorizePayPalOrder(data).then((res) => {
          this._router.navigateByUrl('/checkout/success', {
            state: { data: res.orden },
          });
        }),
    };
  }

  createPayPalOrder(): Promise<any> {
    return new Promise((res, rej) => {
      try {
        if (this.form.invalid)
          throw { error: 'Información de envío inválida.' };
        let checkoutData = {
          token: { type: 'payPal' },
          info: { ...this.form.value, nombreCliente: this.payName },
          coupon: this.coupon?.codigo,
          checkout: this.car,
        };
        this._api.Checkout.pagarPayPal(checkoutData)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(
            (response: any) => {
              if (response) {
                this.datosOrden = response.datos;
                res(response.orden);
              }
              throw { error: 'Verifique su en conexión' };
            },
            (error) => {
              let payError = error.error.message.error;
              if (payError) {
                throw { error: payError };
              } else {
                throw { error: 'Verifique su conexión.' };
              }
            }
          );
      } catch (error) {
        if (error.error) error = error.error;
        this._toastr.error(error, 'Error al pagar.');
        rej(error);
      }
    });
  }

  authorizePayPalOrder(data: IOnApproveCallbackData): Promise<any> {
    return new Promise((res, rej) => {
      try {
        this._api.Checkout.confirmarPagoPayPal({
          data: this.datosOrden,
          orderId: data.orderID,
        })
          .pipe(takeUntil(this.onDestroy))
          .subscribe(
            (response) => {
              res(response);
            },
            (err) => {
              rej(err);
            }
          );
      } catch (error) {
        this._toastr.error(error, 'Error al finalizar Transacción.');
        rej(error);
      }
    });
  }

  getStates() {
    this._api
      .localGet({ model: 'assets/json/countries.json' })
      .pipe(takeUntil(this.onDestroy))
      .subscribe((countries: any) => (this.paises = countries));
    this._api
      .localGet({ model: 'assets/json/states.json' })
      .pipe(takeUntil(this.onDestroy))
      .subscribe((states: any) => (this.estadosMx = states));
  }
  disableScroll() {
    document.body.classList.add('stop-scrolling');
  }
  enableScroll() {
    document.body.classList.remove('stop-scrolling');
  }

  async pay() {
    if (this.paying) return;
    try {
      if (this.form.invalid) throw { error: 'Información de envío inválida.' };
      let payType = this.form.controls.metodoPago.value;
      payType = payType === 'tarjeta' ? 'card' : 'oxxo';
      if (payType === 'card' && this.payForm.invalid)
        throw { error: 'Información de pago inválida' };

      this.paying = true;
      this.disableScroll();
      try {
        let data: any = await this.payWithMethod(payType);
        if (payType === 'oxxo') {
          let paymentMethod: PaymentMethod = data.method.paymentMethod;
          let paymentIntent: Stripe.PaymentIntent = data.data;
          let email = paymentMethod.billing_details.email || '';
          let name = paymentMethod.billing_details.name || '';
          let clientSecret = paymentIntent.client_secret || '';
          this._stripe
            .confirmOxxoPayment(clientSecret, {
              receipt_email: email,
              payment_method: paymentIntent.payment_method || '',
            })
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (res: any) => {
                console.log(res);
              },
              (err: any) => {
                this._toastr.error(
                  'Error al confirmar pago oxxo.',
                  'Error al pagar Oxxo'
                );
              }
            );
        }
        this._router.navigateByUrl('/checkout/success', {
          state: { data: data.data },
        });
      } catch (error) {
        console.log(error);
        this._toastr.error(error.error, 'Error al pagar.');
      } finally {
        this.paying = false;
        this.enableScroll();
      }
    } catch (error) {
      if (error.error) error = error.error;
      this._toastr.error(error, 'Error al pagar.');
    } finally {
      this.paying = false;
      this.enableScroll();
    }
  }

  payWithMethod(type: any) {
    return new Promise((res, rej) => {
      let paymentMethodData: any = { type: type };
      if (type === 'oxxo') {
        paymentMethodData = {
          ...paymentMethodData,
          billing_details: {
            email: this.form.controls.correo.value,
            name: this.payName,
          },
        };
      } else if (type === 'card') {
        paymentMethodData = {
          ...paymentMethodData,
          card: this.payCard.element,
          billing_details: {
            name: this.cardName,
            email: this.form.controls.correo.value,
          },
        };
      }

      this._stripe
        .createPaymentMethod(paymentMethodData)
        .pipe(
          takeUntil(this.onDestroy),
          mergeMap((method) => {
            if (method.error) return throwError(method.error);
            return of(method);
          })
        )
        .subscribe(
          (method) => {
            this.sendPay(method)
              .then((data) => {
                res(data);
              })
              .catch((err) => {
                rej(err);
              });
          },
          (error) => {
            rej({ error: error.message });
          }
        );
    });
  }

  sendPay(method: {
    paymentMethod?: PaymentMethod | undefined;
    error?: StripeError | undefined;
  }) {
    return new Promise((res, rej) => {
      let checkoutData = {
        token: method.paymentMethod,
        info: { ...this.form.value, nombreCliente: this.payName },
        coupon: this.coupon?.codigo,
        checkout: this.car,
      };
      this._api.Checkout.pagar(checkoutData)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(
          (response: any) => {
            if (response) {
              res({
                data: response.paymentIntent,
                method,
                venta: response.venta,
              });
            }
            rej({ error: 'Verifique su en conexión' });
          },
          (error) => {
            let payError = error.error.message.error;
            if (payError) {
              rej({ error: payError });
            } else {
              rej({ error: 'Verifique su conexión.' });
            }
          }
        );
    });
  }

  changeCoupon() {
    this._car.Coupon.update({ codigo: this.couponControl.value });
    this._car.Coupon.verify(true);
  }
  // removeItem(index: number) {
  //   this._car.Item.remove(index);
  //   this._toastr.success('Se ha eliminado el producto correctamente', '', {
  //     timeOut: 2000,
  //   });
  // }

  checkCP() {
    let cp = this.form.controls.cp.value;
    if (cp.length >= 3) {
      if (cp.substr(0, 3) == '812') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  validateForm() {
    try {
      let formObj = this.form.value;
      if (!formObj.nombreCliente) {
        throw 'Ingresa tu nombre completo.';
      }
      if (!formObj.correo) {
        throw 'Ingresa el correo electrónico.';
      }
      if (!formObj.pais) {
        throw 'Selecciona país.';
      }
      if (!formObj.estado) {
        throw 'Selecciona estado.';
      }
      if (!formObj.ciudad) {
        throw 'Igresa el nombre de tu ciudad.';
      }
      if (!formObj.calle) {
        throw 'Ingresa el nombre de la calle.';
      }
      if (!formObj.numExt) {
        throw 'Ingresa el nº exterior del domicilio.';
      }
      if (!formObj.cp) {
        throw 'Ingresa código postal.';
      }
      if (!formObj.telefono) {
        throw 'Ingresa tu número teléfonico.';
      }
      // if (formObj.metodoPago == 'tarjeta' && !this.cardPaymentMethod) {
      //   throw 'Ingresa los 16 dígitos de la tarjeta';
      // }
      let somethingInvalidMsg = this.checkEachInputValidations();
      if (somethingInvalidMsg) throw somethingInvalidMsg;
      return true;
    } catch (err) {
      this._toastr.warning(err, 'Información faltante.');
      return false;
    }
  }

  checkEachInputValidations() {
    const invalid = [];
    const controlsFormPrincipal = this.form.controls;
    for (const attrName in controlsFormPrincipal) {
      if (controlsFormPrincipal[attrName].invalid) {
        invalid.push({ attrName: attrName });
      }

      if (invalid.length) {
        // hay campos vacios del form y sub forms
        return this.showMissingFieldMessage(invalid);
      }
    }
    return false;
  }

  showMissingFieldMessage(invalid: any) {
    let firstInvalid = invalid[0];
    let msj = '';
    switch (firstInvalid.attrName) {
      case 'correo':
        msj = 'El formato del correo electrónico es incorrecto.';
        break;
      case 'numExt':
        msj = 'El formato del número exterior es incorrecto.';
        break;
      case 'numInt':
        msj = 'El formato del número interior es incorrecto.';
        break;
      case 'cp':
        msj = 'El formato del código postal es incorrecto.';
        break;
      case 'telefono':
        msj = 'El formato del teléfono es incorrecto.';
        break;
    }
    return msj;
  }

  trackByFn(index: any, item: any) {
    return index; // or item.id
  }

  toastrError(mensaje: string) {
    this._toastr.error(mensaje, '', { timeOut: 5000 });
  }

  get f() {
    return this.form.controls;
  }
  get payName() {
    return `${this.form.controls.nombre.value} ${this.form.controls.apellido.value}`;
  }
  get cardName() {
    return `${this.payForm.controls.nombres.value} ${this.payForm.controls.apellidos.value}`;
  }

  set metodoPago(metodo:string){
    this.f.metodoPago.setValue(metodo)
  }

  get payDisabled() {
    if (!this.form.valid) return true;
    if (this.f.metodoPago.value === 'oxxo') return false;
    if (this.f.metodoPago.value === 'tarjeta' && this.payForm.valid)
      return false;
    return true;
  }
}
