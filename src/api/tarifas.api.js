import api from './axios'

export const getTarifasPorCiudad = async (ciudadId) => {
  const { data } = await api.get(`/tarifas/ciudad/${ciudadId}`)
  return data
}

export const createTarifa = async (payload) => {
  const { data } = await api.post('/tarifas', payload)
  return data
}

export const updateTarifa = async (id, payload) => {
  const { data } = await api.put(`/tarifas/${id}`, payload)
  return data
}

export const deleteTarifa = async (id) => {
  const { data } = await api.delete(`/tarifas/${id}`)
  return data
}
