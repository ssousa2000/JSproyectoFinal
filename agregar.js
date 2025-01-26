function calcularTotales(){
    let totalSinImpuestos = carrito.reduce((sum, curso)=> sum + curso.total, 0);
    let impuestos = totalSinImpuestos * 0.18;
    let totalFinal = impuestos + totalSinImpuestos;

document.getElementById("totalSinImpuestos").textContent = `USD $${totalSinImpuestos.toFixed(2)}`;
document.getElementById("impuestos").textContent = `USD $${impuestos.toFixed(2)}`;
document.getElementById("totalFinal").textContent = `USD $${totalFinal.toFixed(2)}`;
};

const carritoBody = document.getElementById("carritoBody");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
actualizarCarrito();
calcularTotales();
function actualizarCarrito() {
    carritoBody.innerHTML = "";
    carrito.forEach(({ nombre, precio, cantidad, total }) => {
        const fila = `
            <tr> 
                <td>${nombre}</td>
                <td>$${precio}</td>
                <td>${cantidad}</td>
                <td>$${total}</td>
            </tr>
        `;
        carritoBody.innerHTML += fila;
        localStorage.setItem("carrito", JSON.stringify(carrito));

    });
}


const botonesAgregar = document.querySelectorAll('.btn-agregar');
botonesAgregar.forEach((boton) => {
    boton.addEventListener("click",() => {
        const nombre = boton.dataset.nombre;
        const precio = parseInt(boton.dataset.precio);
        const cursoExistente = carrito.find((curso)=>curso.nombre === nombre);

        if (cursoExistente && cursoExistente.cantidad >= 3) {
            Swal.fire({
                icon: 'warning',
                title: 'Límite alcanzado',
                text: 'El acceso al curso es de tres dispositivos maximo !.',
            });
            return;
        };
        if (cursoExistente) {
            carrito = carrito.map((curso) =>
                curso.nombre === nombre
                    ? { ...curso, cantidad: curso.cantidad + 1, total: curso.total + precio }
                    : curso
            );
        } else {
            carrito.push({ nombre, precio, cantidad: 1, total: precio });
        }
        

        console.log(carrito);
        actualizarCarrito();
        calcularTotales();
    });
});

const botonQuitar = document.querySelectorAll('.btn-quitar');
botonQuitar.forEach((boton) => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = parseInt(boton.dataset.precio);
        const cursoExistente = carrito.find((curso) => curso.nombre === nombre);
        if (cursoExistente) {
            cursoExistente.cantidad -= 1;
            cursoExistente.total -= precio;
            if (cursoExistente.cantidad === 0) {
                const index = carrito.indexOf(cursoExistente); 
                carrito.splice(index, 1); 
            }} else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Este curso no se encuentra en el carrito.',
                    });
                    
                
        }
        actualizarCarrito(); 
        calcularTotales();
    });
});
const vaciarCarrito = document.getElementById('btn-vaciarCarrito');
vaciarCarrito.addEventListener("click", () => {
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
    calcularTotales();
});
async function cargarCursos() {
    const response = await fetch('cursos.json');
    if (!response.ok) {
        throw new Error('Error al cargar los cursos');
    }
    const cursos = await response.json();
    renderizarCursos(cursos);
};

function renderizarCursos(cursos) {
    const tbody = document.getElementById("cursoBody");
    tbody.innerHTML = '';
    cursos.forEach(curso => {
        const fila = `
            <tr>
                <td>${curso.nombre}</td>
                <td>$${curso.precio}</td>
                <td><button class="btn-agregar" data-nombre="${curso.nombre}" data-precio="${curso.precio}">Agregar</button></td>
                <td><button class="btn-quitar" data-nombre="${curso.nombre}" data-precio="${curso.precio}">Quitar</button></td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
    asignarEventos();
};

cargarCursos();

function asignarEventos() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const precio = parseInt(boton.dataset.precio);
            const cursoExistente = carrito.find((curso) => curso.nombre === nombre);

            if (cursoExistente && cursoExistente.cantidad >= 3) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Límite alcanzado',
                    text: 'Solo se permiten 3 productos por usuario.',
                });
                return;
            }

            if (cursoExistente) {
                carrito = carrito.map((curso) =>
                    curso.nombre === nombre
                        ? { ...curso, cantidad: curso.cantidad + 1, total: curso.total + precio }
                        : curso
                );
            } else {
                carrito.push({ nombre, precio, cantidad: 1, total: precio });
            }

            actualizarCarrito();
            calcularTotales();
        });
    });

    const botonesQuitar = document.querySelectorAll('.btn-quitar');
    botonesQuitar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const cursoExistente = carrito.find((curso) => curso.nombre === nombre);

            if (!cursoExistente) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Este curso no se encuentra en el carrito.',
                });
                return;
            }

            cursoExistente.cantidad -= 1;
            cursoExistente.total -= cursoExistente.precio;

            if (cursoExistente.cantidad === 0) {
                carrito = carrito.filter(curso => curso.nombre !== nombre);
            }

            actualizarCarrito();
            calcularTotales();
        });
    });
}


