

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
        
