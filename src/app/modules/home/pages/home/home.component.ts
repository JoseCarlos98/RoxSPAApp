import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/shared/models/Producto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  public productos: Producto[] = [
    {
      id: 1,
      nombre: 'Producto chafaaghjsbvdkuyasgdigasidfgiasgdiuasgidgasi dgaosydyasvdyasv douvasilodvalsidvipas',
      descuento: 0.3,
      precio: 150,
    },
    {
      id: 2,
      nombre: 'Producto chafa 2',
      precio: 200,
    },
    {
      id: 3,
      nombre: 'Producto chafa 3',
      precio: 320,
    },
    {
      id: 4,
      nombre: 'Producto chafa 2',
      precio: 120,
      descuento: 0.4,
    },
  ];

  ngOnInit(): void {}
}
