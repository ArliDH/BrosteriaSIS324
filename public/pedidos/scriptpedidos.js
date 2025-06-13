const { response } = require("express");

function cargarPaginaP(abrir) {
    fetch(abrir)
        .then(response => response.text())
        .then(html => {
            const contenedor = document.getElementById('Platillos_Pollo');
            contenedor.innerHTML = html;
        })
}

function cerrarSesion() {
    localStorage.removeItem('rol');
    localStorage.removeItem('id');         // Borra solo el rol
    // O bien, borrar todo el almacenamiento local
    // localStorage.clear();

    window.location.href = '../Inicio.html'; // Redirige a página de inicio o login
}

function mostrarPedidos() {
    const pedidos = document.getElementById('tablaPedidos');
    const idUser = localStorage.getItem('id');

    fetch(`/Pedir?id=${idUser}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Validación por si no hay datos
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("No hay pedidos.");
                return;
            }

            // Usamos el primer pedido para mostrar datos generales del usuario
            const primerPedido = data[0];

            document.getElementById('Nombre').textContent = primerPedido.nombre_usuario + " " + primerPedido.apellido_usuario;
            document.getElementById('Nit').textContent = primerPedido.nit_usuario;

            let TotalProductosPedidos = 0;

            data.forEach(pedido => {
                const precio = parseFloat(pedido.precio_platillo);
                const descuento = parseFloat(pedido.descuento_platillo);
                const cantidad = parseInt(pedido.cantidad);
                const total = (precio - (descuento * precio)) * cantidad;

                const tr = document.createElement('tr');
                tr.setAttribute('data-id', pedido.id_pedido);

                tr.innerHTML = `
                    <td>${pedido.platillo_nombre}</td>
                    <td class="cantidad">${cantidad}</td>
                    <td>${precio.toFixed(2)}</td>
                    <td>${(descuento * 100).toFixed(0)}%</td>
                    <td>${total.toFixed(2)}</td>
                    <td class="acciones">
                        <button onclick="editarPedido('${pedido.id_pedido}')">Editar</button>
                        <button onclick="deletPedido('${pedido.id_pedido}')">Eliminar</button>
                    </td>
                `;

                TotalProductosPedidos += total;
                pedidos.appendChild(tr);
            });

            document.getElementById('Total').textContent = `Bs ${TotalProductosPedidos.toFixed(2)}`;
        })
}

function mostrarTodosPedidosClientes() {
    const pedidos = document.getElementById('container_4');

    // Inyectamos el contenido base (HTML estático de la factura con tabla vacía)
    pedidos.innerHTML = `
        <div id="formGC" style="padding: 10px; gap: 5px;">
            <div id="DatosEmpresa">
                <img src="../../uploads/LoginBr.png" alt="#" style="width: 300px; height: 100px;">
                <p>Sucre-Bolivia</p>
                <p>Av Limone Frente a la Facultad de Tecnica</p>
            </div>
            <h1>Lista de Pedido de los Clientes</h1>
            <table id="tablaPedidosGC" style="border-collapse: collapse; border: 2px solid black;">
                <tr style="border: 2px solid black; background-color:rgb(43, 74, 145); color: white;">
                    <td style="border: 2px solid black;">Usuario</td>
                    <td style="border: 2px solid black;">Platillo</td>
                    <td style="border: 2px solid black;">Precio del Platillo</td>
                    <td style="border: 2px solid black;">Descuento</td>
                    <td style="border: 2px solid black;">Cantidad Pedido</td>
                    <td style="border: 2px solid black;">Total Cobrado</td>
                </tr>
            </table>
            <div id="cantidadT" style="display: flex; justify-content: end; gap: 10px; padding: 10px;">
                <label for="#">Total Ganado:</label>
                <label for="#" id="TotalGanado"></label>
            </div>
        </div>
    `;

    // Hacer la solicitud y llenar la tabla
    fetch('/PedidosUser') // ruta que responde con indexTodos()
        .then(res => res.json())
        .then(data => {
            console.log(data); // inspecciona si llega correctamente
            const tabla = document.getElementById('tablaPedidosGC');

            let TotalProductosPedidos = 0;
            data.forEach(pedido => {
                const precio = parseFloat(pedido.precio_platillo);
                const descuento = parseFloat(pedido.descuento_platillo);
                const cantidad = parseInt(pedido.cantidad);
                const total = (precio - (descuento * precio)) * cantidad;

                const tr = document.createElement('tr');
                tr.style.border = "1px solid black";
                tr.innerHTML = `
                    <td>${pedido.nombre_usuario} ${pedido.apellido_usuario}</td>
                    <td>${pedido.platillo_nombre}</td>
                    <td>${precio.toFixed(2)}</td>
                    <td>${(descuento * 100).toFixed(0)}%</td>
                    <td>${pedido.cantidad}</td>
                    <td>${total.toFixed(2)}</td>
                `;
                TotalProductosPedidos += total;
                tabla.appendChild(tr);
            });

            document.getElementById('TotalGanado').textContent = `Bs ${TotalProductosPedidos.toFixed(2)}`;
        })
        .catch(err => {
            console.error("Error al obtener los pedidos:", err);
            pedidos.innerHTML = `<p style="color: red;">Error al cargar los pedidos de clientes.</p>`;
        });
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

function mostrarPedidosRol() {
    const roluser = localStorage.getItem('rol');
    if (roluser === 'cajero' || roluser === 'gerente') {
        mostrarTodosPedidosClientes();
    } else if (roluser === 'cliente') {
        mostrarPedidos();
    }
}

function editarPedido(idPedido) {
    const tr = document.querySelector(`tr[data-id="${idPedido}"]`);
    const cantidadTd = tr.querySelector('.cantidad');
    const accionesTd = tr.querySelector('.acciones');

    // Guardar valor actual
    const cantidadActual = cantidadTd.textContent;

    // Reemplazar la cantidad por un input
    cantidadTd.innerHTML = `<input type="number" id="inputCantidad-${idPedido}" value="${cantidadActual}" min="1" style="width: 60px;">`;

    // Reemplazar botones por Guardar y Cancelar
    accionesTd.innerHTML = `
        <button onclick="guardarEdicion(${idPedido})">Guardar</button>
        <button onclick="cancelarEdicion(${idPedido}, ${cantidadActual})">Cancelar</button>
    `;
}

function guardarEdicion(idPedido) {
    const input = document.getElementById(`inputCantidad-${idPedido}`);
    const nuevaCantidad = parseInt(input.value);

    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
        fetch('/Pedir/editar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idPedido, cantidad: nuevaCantidad })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Cantidad actualizada correctamente");
                    location.reload();
                } else {
                    alert("Error al actualizar la cantidad");
                }
            });
    } else {
        alert("Cantidad inválida");
    }
}

function cancelarEdicion(idPedido, cantidadOriginal) {
    location.reload(); // También podrías restaurar manualmente el contenido si no deseas recargar
}


function deletPedido(idPedido) {
    if (confirm("¿Estás seguro de que quieres eliminar este pedido?")) {
        fetch(`/Pedir/eliminar/${idPedido}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Pedido eliminado correctamente");
                    location.reload(); // Recargar la tabla
                } else {
                    alert("Error al eliminar el pedido");
                }
            });
    }
}