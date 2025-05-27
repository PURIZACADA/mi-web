// Recuperar carrito desde LocalStorage si existe
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar productos al carrito con manejo de cantidad
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    actualizarStorage();
    mostrarCarrito();
}

// Función para mostrar el carrito en pantalla con descuento corregido
function mostrarCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    
    if (!listaCarrito) {
        console.error("Elemento 'listaCarrito' no encontrado.");
        return;
    }
    
    listaCarrito.innerHTML = '';

    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li>No hay productos en el carrito.</li>';
    } else {
        carrito.forEach(function(item, index) {
            const elemento = document.createElement('li');
            elemento.textContent = `${item.nombre} - S/${item.precio} x ${item.cantidad} = S/${item.precio * item.cantidad}`;
            total += item.precio * item.cantidad;

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'X';
            botonEliminar.onclick = function() {
                eliminarProducto(index);
            };
            botonEliminar.style.marginLeft = '10px';
            botonEliminar.style.backgroundColor = '#ff4d4d';
            botonEliminar.style.color = '#fff';
            botonEliminar.style.border = 'none';
            botonEliminar.style.cursor = 'pointer';

            elemento.appendChild(botonEliminar);
            listaCarrito.appendChild(elemento);
        });

        // Descuento solo a partir del segundo producto
        const descuento = carrito.length > 1 ? carrito.length - 1 : 0;
        const totalConDescuento = total - descuento;

        const totalOriginalElemento = document.createElement('li');
        totalOriginalElemento.textContent = `Total sin descuento: S/${total}`;
        listaCarrito.appendChild(totalOriginalElemento);

        const descuentoElemento = document.createElement('li');
        descuentoElemento.textContent = `Descuento (${descuento} soles): -S/${descuento}`;
        descuentoElemento.style.color = '#00ff00';
        listaCarrito.appendChild(descuentoElemento);

        const totalFinalElemento = document.createElement('li');
        totalFinalElemento.textContent = `Total con descuento: S/${totalConDescuento}`;
        totalFinalElemento.style.fontWeight = 'bold';
        listaCarrito.appendChild(totalFinalElemento);
    }
}

// Función para eliminar productos
function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarStorage();
    mostrarCarrito();
}

// Función para actualizar el LocalStorage
function actualizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para generar el mensaje del pedido y abrir WhatsApp con descuento corregido
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    let mensaje = "Hola, quiero hacer un pedido:\n";

    let total = 0;
    carrito.forEach(item => {
        mensaje += `- ${item.nombre} x ${item.cantidad} = S/${item.precio * item.cantidad}\n`;
        total += item.precio * item.cantidad;
    });

    const descuento = carrito.length > 1 ? carrito.length - 1 : 0;
    const totalConDescuento = total - descuento;

    mensaje += `Total sin descuento: S/${total}\n`;
    mensaje += `Descuento (${descuento} soles): -S/${descuento}\n`;
    mensaje += `Total con descuento: S/${totalConDescuento}\n\n¡Gracias!`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = "51955099644";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
}

// Mostrar el carrito al cargar la página
mostrarCarrito();

// Asociar el botón Finalizar Compra a la función
document.addEventListener('DOMContentLoaded', () => {
    const btnFinalizar = document.getElementById('finalizarCompra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
});
