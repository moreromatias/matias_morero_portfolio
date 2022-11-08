(function () {

    let idCliente;

    const formulario = document.querySelector('#formulario');

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        // Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar el ID de la URL
        // API URLSearchParams permite buscar los parámetros de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if (idCliente) {

            // LA CONEXION A LA BASE DE DATOS DEMORA UN POCO
            // Si no se usara el timer daría error el código
            // Se podria solucionar con la programación asincrona.
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function obtenerCliente(id) {

        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        console.log(objectStore);

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                if (cursor.value.id == id) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        };
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, empresa, telefono } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('Editado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = (error) => {
            // Para poder debuggear se pasa a consola el error
            console.log(error);
            imprimirAlerta('Hubo un errorr', "error");
        };
    }

})();