(function () {

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        formulario.addEventListener('submit', validarCLiente)
    });

    function validarCLiente(e) {
        e.preventDefault();

        // Leer todos los input
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        };

        // crear un nuevo objeto con la información

        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        };

        // Generar un ID único
        cliente.id = Date.now();

        // añadir a la BD...
        crearNuevoCliente(cliente);
    };

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = () => {
            imprimirAlerta('Hubo un Error', 'error');
        };

        transaction.oncomplete = () => {
            imprimirAlerta('El cliente se agregó correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        };
    }
})();

