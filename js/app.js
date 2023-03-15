const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 20;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarAlerta('Introduzca un término de búsqueda');
        return;
    }

    buscarImagenes(terminoBusqueda);
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('existe');
    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('existe', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;
    const key = "34411696-07ac04b7de5992599d766c8c3";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            console.log(resultado);
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
            console.log(totalPaginas);
        });
}

//Registrar cantidad de páginas usando un generador
function *crearPaginador(total) {
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar arreglo de imagenes
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        //console.log(previewURL);
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}" >
                    <div class="p-4">
                        <p>${likes}<span>Me gusta</span></p>
                        <p>${views}<span>Veces vista</span></p>
                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    //Limpiar paginador previo

    while(paginacion.firstChild){
        paginacion.firstChild.remove();
    }

    imprimirPaginador();

}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const {value, done} = iterador.next();
        console.log(done, value);
        if(done) return;

        //Caso contrario genera boton por elemento
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-2', 'uppercase', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginacion.appendChild(boton);
    }
}