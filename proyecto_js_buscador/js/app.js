//console.log(autos);

// Variables
const marca = document.querySelector("#marca");
const year = document.querySelector("#year");
const minimo = document.querySelector("#minimo");
const maximo = document.querySelector("#maximo");
const puertas = document.querySelector("#puertas");
const transmision = document.querySelector("#transmision");
const color = document.querySelector("#color");

// Contenedor para los resultados
const resultado = document.querySelector("#resultado");

const actual = new Date().getFullYear();
const max = autos.reduce((a, b) => (a.year > b.year ? a : b)).year;
const min = Math.min(...autos.map((item) => item.year, 2000));
const unicos = [...new Set(autos.map((item) => item.year))];
unicos.sort();

// Generar un objeto con la busqueda
const datosBusqueda = {
    marca: "",
    year: "",
    minimo: "",
    maximo: "",
    puertas: "",
    transmision: "",
    color: "",
};

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    mostrarAutos(autos); // Muestra los autos a cargar

    llenarSelectUnicos(); // Llena las opciones de año
});

//Event listeners para los select de búsqueda
marca.addEventListener("change", (e) => {
    datosBusqueda.marca = e.target.value;
    filtrarAuto();
});
year.addEventListener("change", (e) => {
    datosBusqueda.year = parseInt(e.target.value);
    filtrarAuto();
});
minimo.addEventListener("change", (e) => {
    datosBusqueda.minimo = e.target.value;
    filtrarAuto();
});
maximo.addEventListener("change", (e) => {
    datosBusqueda.maximo = e.target.value;
    filtrarAuto();
});
puertas.addEventListener("change", (e) => {
    datosBusqueda.puertas = parseInt(e.target.value);
    filtrarAuto();
});
transmision.addEventListener("change", (e) => {
    datosBusqueda.transmision = e.target.value;
    filtrarAuto();
});
color.addEventListener("change", (e) => {
    datosBusqueda.color = e.target.value;
    filtrarAuto();
});

// Funciones
function mostrarAutos(autos) {
    LimpiarHTML(); // Elimina el HTML previo

    autos.forEach((auto) => {
        const { marca, modelo, year, precio, puertas, color, transmision } =
            auto;
        const autoHTML = document.createElement("p");
        autoHTML.textContent = `
            ${marca} - ${modelo} - ${year} - ${puertas} puertas - ${color} - Transmisión: ${transmision} - Precio: $ ${precio}
        
        `;

        // Insertar en el HTML
        resultado.appendChild(autoHTML);
    });
}

// Limpiar el HTML
function LimpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Genera los años del select - VALORES UNICOS
function llenarSelectUnicos() {
    for (let i = unicos.length - 1; i >= 0; i--) {
        const opcion = document.createElement("option");
        opcion.value = unicos[i];
        opcion.textContent = unicos[i];
        year.appendChild(opcion); // Agrega las opciones de año al select
    }
}

// Funcion que filtra en base a la búsqueda
function filtrarAuto() {
    const resultado = autos
        .filter(filtrarMarca)
        .filter(filtrarYear)
        .filter(filtrarMin)
        .filter(filtrarMax)
        .filter(filtrarPuertas)
        .filter(filtrarTransmision)
        .filter(filtrarColor);

    if (resultado.length) {
        mostrarAutos(resultado);
    } else {
        noResultado();
    }
}

function noResultado() {
    LimpiarHTML();
    const noResultado = document.createElement("div");
    noResultado.classList.add("alerta", "error");
    noResultado.textContent =
        "No hay resultados. Intenta con otros términos de búsqueda";
    resultado.appendChild(noResultado);
}

function filtrarMarca(auto) {
    const { marca } = datosBusqueda;
    if (datosBusqueda.marca) {
        return auto.marca === marca;
    }
    return auto;
}

function filtrarYear(auto) {
    const { year } = datosBusqueda;
    if (datosBusqueda.year) {
        return auto.year === year;
    }
    return auto;
}

function filtrarMin(auto) {
    const { minimo } = datosBusqueda;
    if (datosBusqueda.minimo) {
        return auto.precio >= minimo;
    }
    return auto;
}

function filtrarMax(auto) {
    const { maximo } = datosBusqueda;
    if (datosBusqueda.maximo) {
        return auto.precio <= maximo;
    }
    return auto;
}

function filtrarPuertas(auto) {
    const { puertas } = datosBusqueda;
    if (datosBusqueda.puertas) {
        return auto.puertas === puertas;
    }
    return auto;
}

function filtrarTransmision(auto) {
    const { transmision } = datosBusqueda;
    if (datosBusqueda.transmision) {
        return auto.transmision === transmision;
    }
    return auto;
}

function filtrarColor(auto) {
    const { color } = datosBusqueda;
    if (datosBusqueda.color) {
        return auto.color === color;
    }
    return auto;
}
