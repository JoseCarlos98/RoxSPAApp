

    // MENU FIJO
    // let menuchico = document.getElementById('menufijo');
    let menu = document.getElementById('menu-fijo');
    let nav = document.getElementById('nav');
    let menu1 = document.getElementById('navbarTogglerDemo03');
    let carritoCompra = document.getElementById('carrito');
   

    window.addEventListener('scroll', function(){
        if((window.pageYOffset) > 35){
            menu.classList.add('menu-fijo');                                    
            nav.style.height="100px"       
            carrito.style.top="110%"                             
            
        }else{
            menu.classList.remove('menu-fijo');                                    
            carrito.style.top="135%"                             
            nav.style.height=""                                    
                                
        }
    })   


    // ABRIR CARRITO


        let iconoCar = document.getElementById('car')
        let carrito = document.getElementById('carrito')
        let cerrar = document.getElementById('cerrar')

        
        iconoCar.addEventListener('click', function(){
                carrito.classList.add('show-car')
        });
        
        cerrar.addEventListener('click', function(){
                carrito.classList.remove('show-car')
        });



        // IMAGENES DE MUESTTRA DE INICIO 
        const productos = [
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
        ]

        // IMAGENES DE MUESTRA DE PRODCTOS 
        const imagenesProductos = [
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
            {
                imagen: '../img/maquillaje3.jpg',
                nombre:'SEPHORA',
                descripcion: 'Desmaquillante 16oz',
                precio: '299.00'
            },
        ]
        let htmlCodeI = '';
        let htmlCodeP = '';
        let imgsIndex = document.getElementById('imagenesIndex');
        let imgsProductos = document.getElementById('imagenesProdutos');
        

        addEventListener('load', ()=>{
            console.log('cargo pantalla');
            for (producto of imagenesIndex) {
                htmlCodeI += `
                <div class="col-md-3 largo" >
                <div class="add-car">
                <p>AGREGAR AL CARRITO</p>
                </div>
                <img src="${producto.imagen}" class="img-p" alt="">
                <div class="info-p">
                <p>${producto.nombre}</p>
                <H2>${producto.descripcion}</H2>
                <h1>${producto.precio}</h1>
                </div>
                </div>
                `;
            }
            imgsIndex.innerHTML = htmlCodeI;
        })

        addEventListener('load', ()=>{
            for (producto of imagenesProductos) {
                htmlCodeP += `
                <div class="col-md-3 largo" >
                <div class="add-car">
                <p>AGREGAR AL CARRITO</p>
                </div>
                <img src="${producto.imagen}" class="img-p" alt="">
                <div class="info-p">
                            <p>${producto.nombre}</p>
                            <H2>${producto.descripcion}</H2>
                            <h1>${producto.precio}</h1>
                        </div>
                    </div>
                `;
            }
            imgsProductos.innerHTML = htmlCodeP;
        })



