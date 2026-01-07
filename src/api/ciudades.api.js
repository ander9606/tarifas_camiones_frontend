import api from './axios'

export const getCiudadesPorDepartamento = async (departamentoId) => {
  const { data } = await api.get(`/api/ciudades/departamento/${departamentoId}`)
  return data
}

export const createCiudad = async (payload) => {
  const { data } = await api.post('/api/ciudades', payload)
  return data
}

export const updateCiudad = async (id, payload) => {
  const { data } = await api.put(`/api/ciudades/${id}`, payload)
  return data
}

export const deleteCiudad = async (id) => {
  const { data } = await api.delete(`/api/ciudades/${id}`)
  return data
}
