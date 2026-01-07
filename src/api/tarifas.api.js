import api from './axios'

export const getTarifasPorCiudad = async (ciudadId) => {
  const { data } = await api.get(`/api/tarifas/ciudad/${ciudadId}`)
  return data
}

export const createTarifa = async (payload) => {
  const { data } = await api.post('/api/tarifas', payload)
  return data
}

export const updateTarifa = async (id, payload) => {
  const { data } = await api.put(`/api/tarifas/${id}`, payload)
  return data
}

export const deleteTarifa = async (id) => {
  const { data } = await api.delete(`/api/tarifas/${id}`)
  return data
}
