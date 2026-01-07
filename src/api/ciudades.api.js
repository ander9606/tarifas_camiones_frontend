import api from './axios'

export const getCiudadesPorDepartamento = async (departamentoId) => {
  const { data } = await api.get(`/ciudades/departamento/${departamentoId}`)
  return data
}

export const createCiudad = async (payload) => {
  const { data } = await api.post('/ciudades', payload)
  return data
}

export const updateCiudad = async (id, payload) => {
  const { data } = await api.put(`/ciudades/${id}`, payload)
  return data
}

export const deleteCiudad = async (id) => {
  const { data } = await api.delete(`/ciudades/${id}`)
  return data
}
