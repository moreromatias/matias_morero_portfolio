/* Para evitar que un nombre de variable o funcion se pueda usar desde otro archivo JS,
se utiliza IIFE: Expresión de función ejecutada inmediatamente
*/

(function () {

    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        // Los clientes se obtienen solo se ejecuta si esta la base de datos
        if (window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);

    })

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);

            // Sweet Alert:
            // Se pone <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> en el HTML
            const confirmar = swal({
                title: "Deseas eliminar este cliente?",
                text: "Una vez eliminado, no sera posible deshacer!",
                icon: "warning",
                buttons: {
                    cancel: "Cancelar",
                    confirm: "Eliminar"
                },
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Se ha eliminado el cliente!", {
                            icon: "success",
                        });

                        const transaction = DB.transaction(['crm'], 'readwrite');
                        const objectStore = transaction.objectStore('crm');

                        objectStore.delete(idEliminar);

                        transaction.oncomplete = function () {
                            console.log("Eliminado");

                            // Eliminar el HTML del cliente
                            e.target.parentElement.parentElement.remove();
                        }

                        transaction.error = function () {
                            console.log("Hubo un error");
                        }
                    } else {
                        swal("El cliente no se ha eliminado");
                        console.log('Continuar');
                    }
                });

            console.log(confirmar);
        }
    }

    // Crea la base de datos de IndexDB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function () {
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function () {
            DB = crearDB.result;
            console.log('DB OK');
        };

        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: false });

            console.log('DB lista y creada');
        }
    }

    function obtenerClientes() {
        // Se abre la conexión
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;

            console.log('lectura DB OK');

            // Leer el contenido de la BD
            const objectStore = DB.transaction('crm').objectStore('crm');

            // openCursor va a ir iterando. Es como el forEach de IndexDB
            objectStore.openCursor().onsuccess = function (e) {

                const cursor = e.target.result;

                if (cursor) {

                    //console.log(cursor.value);
                    const { nombre, email, telefono, empresa, id } = cursor.value;

                    listadoClientes.innerHTML += ` 
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    // Ve al siguiente elemento
                    cursor.continue();

                } else {
                    console.log('No hay mas registros');
                }
            }
        };
    }

})();