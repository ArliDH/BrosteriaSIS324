const { response } = require("express");

function cargarPagina(pagina) {
    fetch(pagina)
        .then(response => response.text())
        .then(html => {
            const contenedor = document.getElementById('Platillos_Pollo');
            contenedor.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar la página');
        });
}

function newplatillo() {
    const form = document.getElementById('formCrear');
    const formData = new FormData(form);

    // Obtener la categoría seleccionada
    const categoriaSeleccionada = document.querySelector('input[name="categoria"]:checked');
    if (categoriaSeleccionada) {
        formData.set('categoria', categoriaSeleccionada.value);
    } else {
        alert('Por favor selecciona una categoría');
        return;
    }

    // 🔍 Mostrar en consola los datos del formulario
    console.log('Datos enviados al servidor:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    fetch('/platillos', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json(); // Asegúrate de retornar la promesa de la respuesta
        })
        .then(data => {
            console.log(data);
            if (data.success) {
                mostrarTodo(); // Llama a la función para mostrar todos los platillos
                alert('Platillo creado con éxito');
            } else {
                alert('Error al crear el platillo: ' + data.message);
            }
        })
}


/*function mostrarTodo() {
    fetch('/platillos')  // Aquí se hace la petición para obtener todos los platillos
        .then(response => response.json())  // Asegúrate de que la respuesta sea en formato JSON
        .then(data => {
            console.log(data);
            const div = document.getElementById('Platillos_Pollo');
            div.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevos platillos

            if (data && data.length > 0) {  // Asegúrate de que 'data' no esté vacío
                data.forEach(platillo => {
                    const newPlatillo = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = platillo.img;
                    img.alt = platillo.nombre;
                    img.style.width = '100px';
                    img.style.height = '100px';
                    const name = document.createElement('h3');
                    name.textContent = platillo.nombre;
                    const description = document.createElement('p');
                    description.textContent = platillo.descripcion;
                    const precio = document.createElement('p');
                    precio.textContent = 'Bs' + platillo.precio;

                    //Creando boton de editar:
                    const botonEditar = document.createElement('button');
                    botonEditar.textContent = "Editar Platillo";

                    botonEditar.addEventListener('click', () => {
                        const codigo = platillo.codigo;
                        datosaeditar(codigo);
                        cargarPagina('EditPlatillo.html')
                    })
                    //Creando boton de eliminar:
                    const botonEliminar = document.createElement('button');
                    botonEliminar.textContent = "Eliminar Platillo";

                    botonEliminar.addEventListener('click', () => {
                        const codigo = platillo.codigo;
                        eliminarPlatillo(codigo);
                    });

                    newPlatillo.appendChild(img);
                    newPlatillo.appendChild(name);
                    newPlatillo.appendChild(description);
                    newPlatillo.appendChild(precio);
                    newPlatillo.appendChild(botonEditar);
                    newPlatillo.appendChild(botonEliminar);
                    div.appendChild(newPlatillo);
                });

                modal.style.display = 'none';


            } else {
                alert('No se han encontrado platillos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los platillos');
        });
}*/

function mostrarTodo() {
    // Obtener categorías seleccionadas
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('input[name="catg"]:checked'))
        .map(input => input.value);  // ['platillo', 'bebidas']

    fetch('/platillos')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const div = document.getElementById('Platillos_Pollo');
            div.innerHTML = '';

            // Filtrar según categorías seleccionadas
            const platillosFiltrados = categoriasSeleccionadas.length > 0
                ? data.filter(platillo => categoriasSeleccionadas.includes(platillo.categoria))
                : data;  // si no se selecciona nada, mostrar todo

            if (platillosFiltrados.length > 0) {
                platillosFiltrados.forEach(platillo => {
                    const newPlatillo = document.createElement('div');
                    newPlatillo.style.gap = "10px";
                    newPlatillo.style.border = "none";
                    newPlatillo.style.borderRadius = "10px";
                    newPlatillo.style.boxShadow = "0px 0px 5px black";
                    const img = document.createElement('img');
                    img.src = platillo.img;
                    img.alt = platillo.nombre;
                    img.style.width = '100%';
                    img.style.height = '180px';
                    const name = document.createElement('h3');
                    name.textContent = platillo.nombre;
                    const description = document.createElement('p');
                    description.textContent = platillo.descripcion;

                    newPlatillo.appendChild(img);
                    newPlatillo.appendChild(name);
                    newPlatillo.appendChild(description);

                    var desct = parseFloat(platillo.descuento);
                    var prod_desct = parseFloat(platillo.precio); // Usa float para precisión decimal
                    const precio = document.createElement('p');

                    if (desct === 0) {
                        precio.textContent = 'Bs ' + prod_desct.toFixed(2); // Muestra 2 decimales
                        newPlatillo.appendChild(precio);
                    } else {
                        var totaldesct = prod_desct - (prod_desct * desct);
                        var porcentaje_desct = (desct * 100).toFixed(0); // Porcentaje sin decimales

                        const descuento_producto = document.createElement('p');
                        const precio1 = document.createElement('p');

                        precio.textContent = 'Bs ' + prod_desct.toFixed(2);
                        precio.style.textDecoration = 'line-through';

                        descuento_producto.textContent = porcentaje_desct + '% de descuento';
                        descuento_producto.style.color = 'red'; // Opcional: resaltarlo

                        precio1.textContent = 'Bs ' + totaldesct.toFixed(2);
                        precio1.style.fontWeight = 'bold';

                        newPlatillo.appendChild(precio);
                        newPlatillo.appendChild(descuento_producto);
                        newPlatillo.appendChild(precio1);
                    }


                    const roluser = localStorage.getItem('rol');
                    if (roluser === 'cajero' || roluser === 'gerente') {
                        const botonEditar = document.createElement('button');
                        botonEditar.textContent = "Editar Platillo";
                        botonEditar.style.backgroundColor= "#34495e";
                        botonEditar.style.color = "white";
                        botonEditar.style.padding = "10px";
                        botonEditar.style.borderRadius = "5px";
                        botonEditar.style.border = "none";
                        botonEditar.addEventListener('click', () => {
                            datosaeditar(platillo.codigo);
                        });

                        const botonEliminar = document.createElement('button');
                        botonEliminar.textContent = "Eliminar Platillo";
                        botonEliminar.style.backgroundColor= "#34495e";
                        botonEliminar.style.color = "white";
                        botonEliminar.style.padding = "10px";
                        botonEliminar.style.borderRadius = "5px";
                        botonEliminar.style.border = "none";
                        botonEliminar.addEventListener('click', () => {
                            eliminarPlatillo(platillo.codigo);
                        });

                        newPlatillo.appendChild(botonEditar);
                        newPlatillo.appendChild(botonEliminar);
                    } else if (roluser === 'cliente') {
                        const botonPedir = document.createElement('button');
                        botonPedir.textContent = "Pedir Platillo";
                        botonPedir.style.backgroundColor= "#34495e";
                        botonPedir.style.color = "white";
                        botonPedir.style.padding = "10px";
                        botonPedir.style.borderRadius = "5px";
                        botonPedir.style.border = "none";
                        botonPedir.addEventListener('click', () => {
                            pedirplatillo(platillo.codigo);
                        });

                        const botoncrear = document.getElementById('botoncrear');
                        botoncrear.style.display = 'none';

                        newPlatillo.appendChild(botonPedir);
                    }

                    div.appendChild(newPlatillo);
                });

                modal.style.display = 'none';
            } else {
                alert('No se han encontrado platillos en las categorías seleccionadas');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los platillos');
        });
}




function datosaeditar(codigo) {
    abrirmodal('EditPlatillo.html');
    fetch(`/platillos/${codigo}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('nombre').value = data.nombre;
                document.getElementById('descripcion').value = data.descripcion;
                document.getElementById('precio').value = data.precio;

                if (data.img) {
                    const preview = document.getElementById('preview');
                    preview.src = data.img;
                    preview.style.display = 'block';
                }

                document.getElementById('descuento').value = data.descuento;

                // Marcar el radio según la categoría
                const radios = document.getElementsByName('categoria');
                radios.forEach(radio => {
                    if (radio.value === data.categoria) {
                        radio.checked = true;
                    }
                });

                // Guardar el código para el envío posterior
                const form = document.getElementById('Editar');
                form.setAttribute('data-codigo', codigo);

                // Asignar el evento submit solo una vez
                form.onsubmit = function (e) {
                    e.preventDefault();
                    editarPlatillo(codigo); // Llamar a la función de actualización
                };


            } else {
                alert('No se encontró el platillo');
            }
        })
}


function editarPlatillo(codigo) {
    const form = document.getElementById('Editar');
    const formData = new FormData(form);

    // Asegurarse de obtener la categoría seleccionada
    const categoriaSeleccionada = document.querySelector('input[name="categoria"]:checked');
    if (categoriaSeleccionada) {
        formData.set('categoria', categoriaSeleccionada.value);
    } else {
        alert('Selecciona una categoría');
        return;
    }

    fetch(`/platillos/${codigo}`, {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Platillo actualizado con éxito');
                var modal = document.getElementById('modal');
                modal.style.display = 'none';
                mostrarTodo(); // Refrescar la lista
            } else {
                alert('Error al actualizar: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el platillo');
        });
}


function eliminarPlatillo(codigo) {
    fetch(`/platillos/${codigo}`, {
        method: 'DELETE',  // Cambiar a método DELETE
    })
        .then(response => response.json())
        .then(data => {
            alert('Platillo eliminado con éxito: ' + data.message);
            mostrarTodo();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar platillo');
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

            document.querySelector('#cerrar').addEventListener('click', () => {
                modal.style.display = 'none';
            })
        })
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

function cerrarSesion() {
    localStorage.removeItem('rol');         // Borra solo el rol
    localStorage.removeItem('id');
    // O bien, borrar todo el almacenamiento local
    // localStorage.clear();

    window.location.href = '../Inicio.html'; // Redirige a página de inicio o login
}


//Pedidos

function pedirplatillo(codigo) {
    const iduser = localStorage.getItem('id');
    const idplatillo = codigo;

    const formData = {
        idUsuario: iduser,
        idPlatillo: idplatillo
    };

    for (let campo in formData) {
        console.log(`${campo}: ${formData[campo]}`);
    }

    fetch(`/Pedir`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('Pedido registrado con éxito');
            } else {
                alert('Error al registrar el pedido');
            }
        })
}
