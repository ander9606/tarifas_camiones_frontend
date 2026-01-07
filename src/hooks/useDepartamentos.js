import { useEffect, useState } from 'react'
import { getDepartamentos } from '../api/departamentos.api'

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargarDepartamentos = async () => {
    try {
      setLoading(true)
      const data = await getDepartamentos()
      setDepartamentos(data)
    } catch (err) {
      setError('Error cargando departamentos: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDepartamentos()
  }, [])

  return {
    departamentos,
    loading,
    error,
    reload: cargarDepartamentos
  }
}
