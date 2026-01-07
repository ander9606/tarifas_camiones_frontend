import api from './axios'

export const getTiposCamion = async () => {
  const { data } = await api.get('/api/tipos-camion')
  return data
}

export const getTipoCamionById = async (id) => {
  const { data } = await api.get(`/api/tipos-camion/${id}`)
  return data
}

export const createTipoCamion = async (payload) => {
  const { data } = await api.post('/api/tipos-camion', payload)
  return data
}

export const updateTipoCamion = async (id, payload) => {
  const { data } = await api.put(`/api/tipos-camion/${id}`, payload)
  return data
}

export const deleteTipoCamion = async (id) => {
  const { data } = await api.delete(`/api/tipos-camion/${id}`)
  return data
}
