import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from 'src/app/shared/models/Producto.model';
import { environment } from 'src/environments/environment';

export type reqData = {
  model: string;
  endpoint?: string;
  params?: any;
  body: any;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = environment.apiUrl;

  public Productos = {
    getAdvanced: (params?: any) =>
      this.get({ model: 'productos', endpoint: 'getAdvanced', params }),
    getAll: (params?: any) =>
      this.get({ model: 'productos', endpoint: 'getAll', params }),
    getCategorias: (params?: any) =>
      this.get({ model: 'productos', endpoint: 'getCategorias', params }),
    getProductosTipo: (params?: any) =>
      this.get({ model: 'productos', endpoint: 'getProductosTipo', params }),
    getProductosRandom: (params?: any) =>
      this.get({ model: 'productos', endpoint: 'getProductosRandom', params }),
    getProductosRandomTipo: (params?: any) =>
      this.get({
        model: 'productos',
        endpoint: 'getProductosRandomTipo',
        params,
      }),
  };

  public Categorias = {
    Productos: {
      getAll: (params?: any) =>
        this.get({ model: 'categorias/productos', endpoint: 'getAll', params }),
    },
    Servicios: {
      getAll: (params?: any) =>
        this.get({ model: 'categorias/servicios', endpoint: 'getAll', params }),
    },
  };

  public Checkout = {
    pagar: (body: any, params?: any) =>
      this.post({ model: 'checkout', endpoint: 'pagar', params, body }),
    notificacionPago: (body: any, params?: any) =>
      this.post({
        model: 'checkout',
        endpoint: 'notificacionPago',
        params,
        body,
      }),
  };

  public Descuentos = {
    verificar: (params?: any) =>
      this.get({ model: 'descuentos', endpoint: 'verificar', params }),
  };

  public get(data: Omit<reqData, 'body'>) {
    let endpoint = data.endpoint ? `/${data.endpoint}`: ''
    return this.http
      .get(`${this.API_URL}/${data.model}${endpoint}`, {
        params: data.params,
      })
      .pipe(catchError(this.handleError));
  }

  public post(data: reqData) {
    let endpoint = data.endpoint ? `/${data.endpoint}`: ''
    return this.http
      .post(`${this.API_URL}/${data.model}${endpoint}`, data.body, {
        params: data.params,
      })
      .pipe(catchError(this.handleError));
  }
  public localGet(data: Omit<reqData, 'body'>) {
    let endpoint = data.endpoint ? `/${data.endpoint}`: ''
    return this.http
      .get(`/${data.model}${endpoint}`, {
        params: data.params,
      })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(`Backend returned error ${error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
