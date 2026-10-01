function TarjetaEquipo({ equipo }) {
  const { id, nombre, categoria, cantidad, disponible } = equipo

  return (
    <article className="tarjeta">
      <h3>{nombre}</h3>
      <p>{id} - {categoria}</p>
      <p>Cantidad: {cantidad}</p>
      <p>{disponible ? 'Disponible' : 'Prestado'}</p>
      <button type="button" disabled={!disponible}>
        {disponible ? 'Solicitar' : 'No disponible'}
      </button>
    </article>
  )
}

export default TarjetaEquipo
