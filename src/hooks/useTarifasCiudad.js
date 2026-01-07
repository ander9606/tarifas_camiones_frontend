import { useState } from 'react'
import { getTarifasPorCiudad } from '../api/tarifas.api'

export function useTarifasCiudad() {
  const [tarifas, setTarifas] = useState([])
  const [loading, setLoading] = useState(false)

  const cargarTarifas = async (ciudadId) => {
    if (!ciudadId) return
    setLoading(true)
    const data = await getTarifasPorCiudad(ciudadId)
    setTarifas(data)
    setLoading(false)
  }

  return {
    tarifas,
    loading,
    cargarTarifas
  }
}
