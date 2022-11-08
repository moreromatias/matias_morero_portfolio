// Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciaCarritoBtn = document.querySelector("#vaciar-carrito");
/** @type {HTMLDivElement} */
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];
console.log(typeof articulosCarrito);

cargarEventListeners();
function cargarEventListeners() {
    // Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener("click", eliminarCurso);

    // Vaciar el carrito
    vaciaCarritoBtn.addEventListener("click", () => {
        articulosCarrito = []; // Reseteamos el arreglo

        limpiarHTML(); // Eliminamos todo el HTML
        localStorage.clear(carrito);
    });

    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    });
}

// Funciones
function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Eliminar un curso del carrito
function eliminarCurso(e) {
    if (e.target.classList.contains("borrar-curso")) {
        const cursoId = e.target.getAttribute("data-id");

        // Elimana del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(
            (curso) => curso.id !== cursoId
        );

        carritoHTML(); // Iterar sobre el carrito y muestra su HTML
    }
}

// Lee el contenido del html al que le dimos click y extrae informacion del curso
function leerDatosCurso(curso) {
    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1,
    };

    // Revisa si elemento ya existe en el carrito
    const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
    if (existe) {
        // Actualizamos la cantidad
        articulosCarrito.forEach((curso) => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
            }
        });
    } else {
        // Agregar arreglos al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    console.log(articulosCarrito);

    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach((curso) => {
        const { imagen, titulo, precio, cantidad, id } = curso; // Destructuring
        const row = document.createElement("tr");
        row.innerHTML = `
        <td> <img src="${imagen}" width="100"> </td>    
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td> <a href="#" class="borrar-curso" data-id="${id}"> X </a> </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
