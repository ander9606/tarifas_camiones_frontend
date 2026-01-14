import { useEffect, useState } from 'react'
import { getDepartamentos, deleteDepartamento, createDepartamento } from '../api/departamentos.api'

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

  const crear = async (payload) => {
    try {
      const nuevoDept = await createDepartamento(payload)
      setDepartamentos([...departamentos, nuevoDept])
      return nuevoDept
    } catch (err) {
      setError('Error creando departamento: ' + err.message)
      throw err
    }
  }

  const eliminar = async (id) => {
    try {
      await deleteDepartamento(id)
      setDepartamentos(departamentos.filter(d => d.id !== id))
    } catch (err) {
      setError('Error al eliminar departamento: ' + err.message)
      throw err
    }
  }

  useEffect(() => {
    cargarDepartamentos()
  }, [])

  return {
    departamentos,
    loading,
    error,
    reload: cargarDepartamentos,
    crear,
    eliminar
  }
}
