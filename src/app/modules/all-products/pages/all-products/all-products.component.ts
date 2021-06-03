import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/shared/models/Producto.model';
import SwiperCore from 'swiper/core';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public productos: Producto[] = Array(15).fill({
    id: 8,
    nombre: 'Desmaquillante 16oz',
    precio: 278.22,
  });
}
