import { useState } from 'react'
import { getCiudadesPorDepartamento, deleteCiudad, createCiudad } from '../api/ciudades.api'

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
      return data
    } catch (err) {
      setError('Error cargando ciudades: ' + err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const crear = async (payload) => {
    try {
      const nuevaCiudad = await createCiudad(payload)
      setCiudades([...ciudades, nuevaCiudad])
      return nuevaCiudad
    } catch (err) {
      setError('Error creando ciudad: ' + err.message)
      throw err
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
    crear,
    eliminar
  }
}
