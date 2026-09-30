import './style.css'
import { productos } from './datos.js'

// ------------------------------------------------------------
// EJERCICIO 2 — Mostrar productos
// ------------------------------------------------------------

const catalogo = document.getElementById('catalogo')

function mostrarProductos(lista) {
  catalogo.innerHTML = lista.map(p => `
    <article class="bg-white rounded-lg shadow p-4">
      <h3 class="text-xl font-bold">${p.nombre}</h3>

      <p class="text-gray-600 mt-2">
        $${p.precio}
      </p>

      <p class="text-sm text-gray-500 mt-1">
        ${p.categoria}
      </p>

      <button
        data-id="${p.id}"
        class="bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-4 hover:bg-blue-800">
        Agregar
      </button>
    </article>
  `).join('')
}

mostrarProductos(productos)


// ------------------------------------------------------------
// EJERCICIO 3 — Armar el pedido
// ------------------------------------------------------------

const pedido = []

catalogo.addEventListener('click', (evento) => {

  const boton = evento.target.closest('button[data-id]')

  if (!boton) return

  const id = Number(boton.dataset.id)

  const producto = productos.find(p => p.id === id)

  if (producto) {
    pedido.push(producto)
    mostrarPedido()
  }
})


function mostrarPedido() {

  const listaPedido = document.getElementById('lista-pedido')
  const total = document.getElementById('total')

  listaPedido.innerHTML = pedido.map(p => `
    <li class="border-b p-2">
      ${p.nombre} - $${p.precio}
    </li>
  `).join('')

  const suma = pedido.reduce(
    (suma, p) => suma + p.precio,
    0
  )

  total.textContent = `Total: $${suma}`
}


const btnVaciar = document.getElementById('btn-vaciar')

btnVaciar.addEventListener('click', () => {

  pedido.length = 0

  mostrarPedido()
})


mostrarPedido()


// ------------------------------------------------------------
// FILTROS POR CATEGORÍA
// ------------------------------------------------------------

const botonesCategoria =
  document.querySelectorAll('.boton-categoria')

botonesCategoria.forEach(boton => {

  boton.addEventListener('click', () => {

    const categoria = boton.dataset.categoria

    if (categoria === 'Todos') {

      mostrarProductos(productos)

    } else {

      const productosFiltrados =
        productos.filter(
          p => p.categoria === categoria
        )

      mostrarProductos(productosFiltrados)
    }

    botonesCategoria.forEach(b => {

      b.classList.remove(
        'bg-blue-600',
        'text-white'
      )

      b.classList.add('bg-white')
    })

    boton.classList.remove('bg-white')

    boton.classList.add(
      'bg-blue-600',
      'text-white'
    )
  })
})


// ------------------------------------------------------------
// EJERCICIO 5 — Datos del cliente con validación
// ------------------------------------------------------------

const formularioCliente =
  document.getElementById('form-cliente')

const nombre =
  document.getElementById('nombre')

const telefono =
  document.getElementById('telefono')

const correo =
  document.getElementById('correo')

const errorNombre =
  document.getElementById('error-nombre')

const errorTelefono =
  document.getElementById('error-telefono')

const errorCorreo =
  document.getElementById('error-correo')

const errorPedido =
  document.getElementById('error-pedido')


// ------------------------------------------------------------
// EJERCICIO 6 Y 7 — Pedidos registrados
// ------------------------------------------------------------

const pedidosRegistrados =
  JSON.parse(
    localStorage.getItem('pedidosRegistrados')
  ) || []


const ESTADOS = [
  'Pendiente',
  'En preparación',
  'Entregado'
]


const COLORES = {

  'Pendiente':
    'bg-yellow-100 border-yellow-400',

  'En preparación':
    'bg-blue-100 border-blue-400',

  'Entregado':
    'bg-green-100 border-green-400'
}


const pedidosRegistradosContenedor =
  document.getElementById(
    'pedidos-registrados'
  )


// ------------------------------------------------------------
// EJERCICIO 7 — Guardar en localStorage
// ------------------------------------------------------------

function guardarPedidos() {

  localStorage.setItem(
    'pedidosRegistrados',
    JSON.stringify(pedidosRegistrados)
  )
}


// ------------------------------------------------------------
// Mostrar pedidos registrados
// ------------------------------------------------------------

function mostrarPedidosRegistrados() {

  pedidosRegistradosContenedor.innerHTML =
    pedidosRegistrados.map(p => `

      <article
        class="${COLORES[p.estado]} border-2 rounded-lg p-4">

        <h3 class="text-xl font-bold">
          ${p.nombre}
        </h3>

        <p class="mt-2">
          <strong>Teléfono:</strong>
          ${p.telefono}
        </p>

        <p>
          <strong>Correo:</strong>
          ${p.correo}
        </p>

        <p class="font-semibold mt-2">
          Estado: ${p.estado}
        </p>

        <ul class="mt-2">
          ${p.productos.map(producto => `
            <li>
              ${producto.nombre} - $${producto.precio}
            </li>
          `).join('')}
        </ul>

        <p class="font-bold mt-3">
          Total: $${p.total}
        </p>

        ${
          p.estado !== 'Entregado'
            ? `
              <button
                data-avanzar="${p.id}"
                class="bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-4 hover:bg-blue-800">
                Avanzar estado
              </button>
            `
            : ''
        }

      </article>

    `).join('')
}


// ------------------------------------------------------------
// VALIDACIÓN Y REGISTRO DEL PEDIDO
// ------------------------------------------------------------

formularioCliente.addEventListener(
  'submit',
  (evento) => {

    evento.preventDefault()

    let formularioValido = true

    errorNombre.textContent = ''
    errorTelefono.textContent = ''
    errorCorreo.textContent = ''
    errorPedido.textContent = ''

    errorNombre.classList.add('hidden')
    errorTelefono.classList.add('hidden')
    errorCorreo.classList.add('hidden')
    errorPedido.classList.add('hidden')

    nombre.classList.remove('border-red-600')
    telefono.classList.remove('border-red-600')
    correo.classList.remove('border-red-600')


    if (nombre.value.trim() === '') {

      errorNombre.textContent =
        'El nombre es obligatorio.'

      errorNombre.classList.remove('hidden')

      nombre.classList.add('border-red-600')

      formularioValido = false
    }


    if (!/^\d{10}$/.test(telefono.value)) {

      errorTelefono.textContent =
        'El teléfono debe tener exactamente 10 dígitos.'

      errorTelefono.classList.remove('hidden')

      telefono.classList.add('border-red-600')

      formularioValido = false
    }


    if (!/^\S+@\S+\.\S+$/.test(correo.value)) {

      errorCorreo.textContent =
        'Ingresa un correo válido.'

      errorCorreo.classList.remove('hidden')

      correo.classList.add('border-red-600')

      formularioValido = false
    }


    if (pedido.length === 0) {

      errorPedido.textContent =
        'El pedido no puede estar vacío.'

      errorPedido.classList.remove('hidden')

      formularioValido = false
    }


    if (formularioValido) {

      const totalPedido = pedido.reduce(
        (suma, p) => suma + p.precio,
        0
      )


      pedidosRegistrados.push({

        id: Date.now(),

        nombre: nombre.value.trim(),

        telefono: telefono.value.trim(),

        correo: correo.value.trim(),

        productos: [...pedido],

        total: totalPedido,

        estado: 'Pendiente'
      })


      guardarPedidos()


      pedido.length = 0

      mostrarPedido()

      formularioCliente.reset()

      mostrarPedidosRegistrados()
    }
  }
)


// ------------------------------------------------------------
// AVANZAR ESTADO DEL PEDIDO
// ------------------------------------------------------------

pedidosRegistradosContenedor.addEventListener(
  'click',
  (evento) => {

    const boton =
      evento.target.closest(
        'button[data-avanzar]'
      )

    if (!boton) return


    const id =
      Number(boton.dataset.avanzar)


    const pedidoRegistrado =
      pedidosRegistrados.find(
        p => p.id === id
      )


    if (!pedidoRegistrado) return


    const posicionActual =
      ESTADOS.indexOf(
        pedidoRegistrado.estado
      )


    const siguienteEstado =
      ESTADOS[posicionActual + 1]


    if (siguienteEstado) {

      pedidoRegistrado.estado =
        siguienteEstado

      guardarPedidos()

      mostrarPedidosRegistrados()
    }
  }
)


// ------------------------------------------------------------
// Cargar pedidos guardados al iniciar
// ------------------------------------------------------------

mostrarPedidosRegistrados()
