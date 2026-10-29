//Juan Camilo Almanza -- Juan David Pinzon -- Mariana Allison Quemba 

// Modelo UML recreado en JavaScript
// Estructura principal: Usuario -> Productora / Consumidor
// Relaciones: Productora administra productos, Pedido contiene detalles y Pago

class Usuario {
  constructor(id, nombre, email, telefono, rol) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.rol = rol;
    this.created_at = new Date();
  }

  actualizarPerfil(nuevoNombre, nuevoEmail, nuevoTelefono, nuevoRol) {
    this.nombre = nuevoNombre;
    this.email = nuevoEmail;
    this.telefono = nuevoTelefono;
    this.rol = nuevoRol;
    return `Perfil actualizado para ${this.nombre}`;
  }

  validarEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this.email);
  }

  esConsumidor() {
    return this.rol === 'consumidor';
  }

  esProductor() {
    return this.rol === 'productor' || this.rol === 'productora';
  }
}

class Productora extends Usuario {
  constructor({
    id,
    nombre,
    email,
    telefono,
    rol,
    usuario_id,
    nombre_finca,
    ubicacion,
    descripcion,
    foto_url,
  }) {
    super(id, nombre, email, telefono, rol);
    this.usuario_id = usuario_id;
    this.nombre_finca = nombre_finca;
    this.ubicacion = ubicacion;
    this.descripcion = descripcion;
    this.foto_url = foto_url;
    this.productos = [];
  }

  validarDatos() {
    return (
      this.nombre_finca.trim() !== '' &&
      this.ubicacion.trim() !== '' &&
      this.descripcion.trim() !== ''
    );
  }

  actualizarInformacion(nuevaFinca, nuevaUbicacion, nuevaDescripcion, nuevaFoto) {
    this.nombre_finca = nuevaFinca;
    this.ubicacion = nuevaUbicacion;
    this.descripcion = nuevaDescripcion;
    this.foto_url = nuevaFoto;
    return `Información actualizada de la finca ${this.nombre_finca}`;
  }

  publicarProducto(producto) {
    if (producto instanceof Producto) {
      this.productos.push(producto);
      return `Producto publicado: ${producto.nombre}`;
    }
    return 'El producto no es válido';
  }
}

class Producto {
  constructor({
    id,
    productora_id,
    nombre,
    descripcion,
    precio,
    unidad_medida,
    stock_disponible,
    foto_url,
    estado,
  }) {
    this.id = id;
    this.productora_id = productora_id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.unidad_medida = unidad_medida;
    this.stock_disponible = stock_disponible;
    this.foto_url = foto_url;
    this.estado = estado;
  }

  actualizarPrecio(nuevoPrecio) {
    this.precio = nuevoPrecio;
    return `Precio actualizado a ${this.precio}`;
  }

  actualizarStock(cantidad) {
    this.stock_disponible += cantidad;
    return `Stock actualizado: ${this.stock_disponible}`;
  }

  verificarDisponibilidad(cantidad) {
    return cantidad <= this.stock_disponible;
  }

  calcularSubtotal(cantidad) {
    return this.precio * cantidad;
  }

  cambiarEstado(nuevoEstado) {
    this.estado = nuevoEstado;
    return `Estado cambiado a ${this.estado}`;
  }
}

class DetallePedido {
  constructor({ id, pedido_id, producto_id, cantidad, precio_unitario }) {
    this.id = id;
    this.pedido_id = pedido_id;
    this.producto_id = producto_id;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
    this.subtotal = 0;
  }

  calcularSubtotal() {
    this.subtotal = this.cantidad * this.precio_unitario;
    return this.subtotal;
  }

  actualizarCantidad(nuevaCantidad) {
    this.cantidad = nuevaCantidad;
    this.calcularSubtotal();
    return `Cantidad actualizada a ${this.cantidad}`;
  }

  validarCantidad() {
    return this.cantidad > 0;
  }
}

class Pedido {
  constructor({ id, consumidor_id, productora_id, total = 0, created_at = new Date() }) {
    this.id = id;
    this.consumidor_id = consumidor_id;
    this.productora_id = productora_id;
    this.total = total;
    this.created_at = created_at;
    this.detalles = [];
    this.estado = 'pendiente';
  }

  agregarDetalle(detalle) {
    if (detalle instanceof DetallePedido) {
      this.detalles.push(detalle);
      this.total += detalle.calcularSubtotal();
      return `Detalle agregado al pedido ${this.id}`;
    }
    return 'Detalle no válido';
  }

  calcularTotal() {
    this.total = this.detalles.reduce((sum, detalle) => sum + detalle.calcularSubtotal(), 0);
    return this.total;
  }

  validarEstado() {
    return ['pendiente', 'confirmado', 'cancelado', 'pagado'].includes(this.estado);
  }

  cambiarEstado(nuevoEstado) {
    this.estado = nuevoEstado;
    return `Pedido ${this.id} ahora está ${this.estado}`;
  }

  cancelar() {
    this.estado = 'cancelado';
    return `Pedido ${this.id} cancelado`;
  }
}

class Pago {
  constructor({ id, pedido_id, metodo, monto, estado = 'pendiente', fecha = new Date() }) {
    this.id = id;
    this.pedido_id = pedido_id;
    this.metodo = metodo;
    this.monto = monto;
    this.estado = estado;
    this.fecha = fecha;
  }

  validarMonto() {
    return this.monto > 0;
  }

  rechazarPago() {
    this.estado = 'rechazado';
    return `Pago ${this.id} rechazado`;
  }

  consultarEstado() {
    return this.estado;
  }
}

// Ejemplo de uso práctico
const consumidor = new Usuario('U-001', 'Ana Gómez', 'ana@gmail.com', '3001234567', 'consumidor');
const productora = new Productora({
  id: 'P-001',
  nombre: 'María López',
  email: 'maria@finca.com',
  telefono: '3109876543',
  rol: 'productora',
  usuario_id: 'U-002',
  nombre_finca: 'Finca La Esperanza',
  ubicacion: 'Calle 12, Popayán',
  descripcion: 'Producción orgánica de frutas y verduras.',
  foto_url: 'https://example.com/finca.jpg',
});

const manzana = new Producto({
  id: 'PR-001',
  productora_id: 'P-001',
  nombre: 'Manzana roja',
  descripcion: 'Manzana fresca y orgánica.',
  precio: 2800,
  unidad_medida: 'kg',
  stock_disponible: 50,
  foto_url: 'https://example.com/manzana.jpg',
  estado: 'disponible',
});

const detalle = new DetallePedido({
  id: 'DP-001',
  pedido_id: 'PED-001',
  producto_id: 'PR-001',
  cantidad: 2,
  precio_unitario: 2800,
});

const pedido = new Pedido({
  id: 'PED-001',
  consumidor_id: consumidor.id,
  productora_id: productora.id,
});

pedido.agregarDetalle(detalle);

const pago = new Pago({
  id: 'PG-001',
  pedido_id: pedido.id,
  metodo: 'Nequi',
  monto: pedido.total,
});

console.log('=== USUARIO ===');
console.log(consumidor.actualizarPerfil('Ana García', 'ana.nueva@gmail.com', '3012223344', 'consumidor'));
console.log('Email válido:', consumidor.validarEmail());

console.log('\n=== PRODUCTORA ===');
console.log(productora.validarDatos());
console.log(productora.actualizarInformacion('Finca El Sol', 'Vereda El Triunfo', 'Cultivo sostenible', 'https://example.com/sol.jpg'));
console.log(productora.publicarProducto(manzana));

console.log('\n=== PRODUCTO ===');
console.log(manzana.verificarDisponibilidad(3));
console.log(manzana.calcularSubtotal(3));
console.log(manzana.cambiarEstado('agotado'));

console.log('\n=== PEDIDO ===');
console.log(pedido.calcularTotal());
console.log(pedido.cambiarEstado('confirmado'));

console.log('\n=== PAGO ===');
console.log(pago.validarMonto());
console.log(pago.consultarEstado());

module.exports = {
  Usuario,
  Productora,
  Producto,
  DetallePedido,
  Pedido,
  Pago,
};
