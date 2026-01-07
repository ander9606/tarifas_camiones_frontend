import { useState } from 'react'
import { getCiudadesPorDepartamento } from '../api/ciudades.api'

export function useCiudades() {
  const [ciudades, setCiudades] = useState([])
  const [loading, setLoading] = useState(false)

  const cargarCiudades = async (departamentoId) => {
    if (!departamentoId) return
    setLoading(true)
    const data = await getCiudadesPorDepartamento(departamentoId)
    setCiudades(data)
    setLoading(false)
  }

  return {
    ciudades,
    loading,
    cargarCiudades
  }
}
