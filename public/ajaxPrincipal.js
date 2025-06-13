const { response } = require("express");

function cargarcontenido(abrir) {
    const contenedor = document.getElementById('container_4_1');
    contenedor.innerHTML = ''; // Limpiar correctamente

    fetch(abrir)
        .then(response => response.text())
        .then(html => {
            contenedor.innerHTML = html; // Cargar contenido HTML

            // Opcional: si necesitas cargar un JS adicional
            const script = document.createElement('script');
            script.src = 'platillos/ajax.js';
            script.defer = true;
            document.body.appendChild(script);

            if (abrir === 'platillos/IndexPlatillo.html') {
                console.log('pagina de platillos');

                // Esperar a que el contenido se cargue en el DOM
                setTimeout(() => {
                    const checkboxes = Array.from(document.getElementsByName('catg'));

                    checkboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', () => {
                            const seleccionados = checkboxes
                                .filter(ch => ch.checked)
                                .map(ch => ch.value);

                            mostrarTodo(seleccionados); // Puedes pasar categorías seleccionadas
                        });
                    });
                }, 50);
            }
        })
        .catch(error => {
            console.error('Error al cargar el contenido:', error);
        });
}


function abrirmodal(abrir) {
    fetch(abrir)
        .then(response => response.text())  // Cargar como texto, no JSON
        .then(data => {
            var modal = document.getElementById('modal');
            modal.style.display = 'block';  // Mostrar el modal
            var contenido = document.getElementById('contenidomodal');
            contenido.innerHTML = data;  // Insertar el contenido HTML dentro del modal

            var boton = document.getElementById('logReg');
            let isRegistrarse = false; // Esta variable controlará qué formulario se muestra

            boton.addEventListener('click', () => {
                // Alternar la visibilidad de los formularios
                if (isRegistrarse) {
                    boton.textContent = "Registrarse"; // Cambiar el texto del botón
                    document.getElementById('divReg').style.display = "none";
                    document.getElementById('divlog').style.display = "block";
                    boton.style.borderBottomLeftRadius = '0px';
                    boton.style.borderBottomRightRadius = '0px';
                    boton.style.borderTopLeftRadius = '10px';
                    boton.style.borderTopRightRadius = '10px';
                } else {
                    boton.textContent = "Iniciar Sesion"; // Cambiar el texto del botón
                    document.getElementById('divlog').style.display = "none";
                    document.getElementById('divReg').style.display = "block";
                    boton.style.borderBottomLeftRadius = '10px';
                    boton.style.borderBottomRightRadius = '10px';
                    boton.style.borderTopLeftRadius = '0px';
                    boton.style.borderTopRightRadius = '0px';
                }
                isRegistrarse = !isRegistrarse; // Alternar el valor de la variable
            })

            document.querySelector('#cerrar').addEventListener('click', () => {
                modal.style.display = 'none';
            })
        })
}

function iniciarsesion() {
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    for (let campo in formData) {
        console.log(`${campo}: ${formData[campo]}`);
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                modal.style.display = 'none';
                console.log(data.user.rol);
                // Guardar el rol del usuario una sola vez
                localStorage.setItem('rol', data.user.rol);
                localStorage.setItem('id', data.user.id);

                const rolUser = localStorage.getItem('rol');

                const idUser = localStorage.getItem('id');

                window.location.href = 'PaginaInicio/Index.html';
                // Redirigir por rol si quieres
            } else {
                alert(data.error);
            }
        });

}

function Registrarse() {
    // Recolectar los datos del formulario
    const formData = {
        username: document.getElementById('usuario').value,
        password: document.getElementById('password1').value,
        email: document.getElementById('email1').value,
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellido').value,
        rol: document.getElementById('rol').value,
        nit: document.getElementById('nit').value
    };

    for (let campo in formData) {
        console.log(`${campo}: ${formData[campo]}`);
    }

    // Enviar los datos con fetch usando JSON
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            console.log(response); if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(data => {
            console.log('Usuario creado:', data);
            alert('Usuario creado exitosamente');
            modal.style.display = 'none';
            alert('inicie sesion con su cuenta para acceder a los beneficios que desea')
        })
}

function cerrarSesion() {
    localStorage.removeItem('rol');         // Borra solo el rol
    localStorage.removeItem('id');
    // O bien, borrar todo el almacenamiento local
    // localStorage.clear();

    window.location.href = '../Inicio.html'; // Redirige a página de inicio o login
}


function verificarRol() {
    const roluser = localStorage.getItem('rol');
    if (roluser === 'cajero' || roluser === 'cliente') {
        const users = document.getElementById('User');
        if (users) {
            users.style.display = 'none';
        }
    }
}


