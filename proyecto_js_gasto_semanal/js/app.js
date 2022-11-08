// Variables y Selectores
const formulario = document.getElementById("agregar-gasto");
const gastosListado = document.querySelector("#gastos ul");

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto);
}

// Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto); // Number pasa a entero o flotante segun sea la entrada
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce(
            (total, gasto) => total + gasto.cantidad,
            0
        );

        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        // Agregar al html
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
            divMensaje.id = "alerta-error";
        } else {
            divMensaje.classList.add("alert-success");
            divMensaje.id = "alerta-exito";
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el HTML
        const alertaError = document.querySelector("#alerta-error");
        if (alertaError !== null) {
            alertaError.remove();
        }

        document
            .querySelector(".primario")
            .insertBefore(divMensaje, formulario);

        // Quitar el HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        // Elimina el HTML previo
        this.limpiarHTML();

        // Iterar sobre los gastos
        gastos.forEach((gasto) => {
            const { cantidad, nombre, id } = gasto;

            // Crear un Li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className =
                "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times"; // &times entidad de HTML. Es el signo × de multiplicación.
            btnBorrar.onclick = () => {
                eliminarGasto(id, cantidad);
            };
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        // Borrar listado anterior
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");

        // Comprobar 25 y 50 %
        if (restante <= 0.25 * presupuesto) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if (restante <= 0.5 * presupuesto) {
            restanteDiv.classList.remove("alert-success", "alert-danger");
            restanteDiv.classList.add("alert-warning");
        } else {
            restanteDiv.classList.remove("alert-warning", "alert-danger");
            restanteDiv.classList.add("alert-success");
        }

        // Si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instanciar
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

    if (
        presupuestoUsuario === "" ||
        presupuestoUsuario === null ||
        isNaN(presupuestoUsuario) ||
        presupuestoUsuario <= 0
    ) {
        window.location.reload();
    }

    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

// Añadir gastos
function agregarGasto(e) {
    console.log(e);
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    // Validar
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no válida", "error");
        return;
    }

    // Generar un objeto con el gasto
    // Object Literal Enhancement
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añande un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Mensaje de todo bien
    ui.imprimirAlerta("Gasto agregado correctamente");

    // Imprimir los gastos
    const { gastos, restante } = presupuesto; // destructuring
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // Elimina el gasto del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
