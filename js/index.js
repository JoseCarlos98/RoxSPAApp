var fondo = document.getElementById("img");
let circulo1 = document.getElementById("circulo1");
let circulo2 = document.getElementById("circulo2");
let circulo3 = document.getElementById("circulo3");

    function cambiarFondo(x) {

        if (x == 1) {
            fondo.src = "img/slide1.jpg";
            circulo1.classList.add("circulito-relleno");
            circulo2.classList.remove("circulito-relleno");
            circulo3.classList.remove("circulito-relleno");
        }else if(x == 2 ){
            fondo.src = "img/slide2.jpg";
            circulo2.classList.add("circulito-relleno");
            circulo1.classList.remove("circulito-relleno");
            circulo1.classList.remove("seleccionado");
            circulo3.classList.remove("circulito-relleno");
        }else if (x == 3){
            fondo.src = "img/slide3.jpg";
            circulo3.classList.add("circulito-relleno");
            circulo1.classList.remove("circulito-relleno");
            circulo2.classList.remove("circulito-relleno");
        }
    }


    // MENU FIJO
    let menuchico = document.getElementById('menufijo');
    let menu = document.getElementById('menu');
    let logofijo = document.getElementById("img-fijo2");
    let aaa = document.getElementById('imgg');
    let logo = document.getElementById('logofijo');
    let menu11= document.getElementById('menu11');
    let fijo= document.getElementById('fijoo');

    window.addEventListener('scroll', function(){
    if((window.pageYOffset) > 35){
        menu.classList.add('nav3');                                    
        menu11.classList.add('cien');                                    
        aaa.classList.add('mg');                                    
        logo.classList.add('logo-fijo');      
        logo.style.display = "block";                              
        logofijo.style.display = "none";                              
        fijo.classList.add('fijo');                                    
    }
    else{
        menu11.classList.remove('cien');                                    
        fijo.classList.remove('fijo');                                    
        menu11.classList.remove('nav-opcionesM');                              
        logofijo.style.display = "block";                              
        menu.classList.remove('nav3');                                    
        aaa.classList.remove('mg');                                    
        logo.style.display = "none";                              
    }

    })   
