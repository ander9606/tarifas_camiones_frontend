import { useState } from 'react'
import { getCiudadesPorDepartamento, deleteCiudad } from '../api/ciudades.api'

export function useCiudades() {
  const [ciudades, setCiudades] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargarCiudades = async (departamentoId) => {
    if (!departamentoId) return
    try {
      setLoading(true)
      const data = await getCiudadesPorDepartamento(departamentoId)
      setCiudades(data)
    } catch (err) {
      setError('Error cargando ciudades: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const eliminar = async (id) => {
    try {
      await deleteCiudad(id)
      setCiudades(ciudades.filter(c => c.id !== id))
    } catch (err) {
      setError('Error al eliminar ciudad: ' + err.message)
      throw err
    }
  }

  return {
    ciudades,
    loading,
    error,
    cargarCiudades,
    eliminar
  }
}
