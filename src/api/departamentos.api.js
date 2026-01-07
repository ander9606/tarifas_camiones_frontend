import api from './axios'

export const getDepartamentos = async () => {
  const { data } = await api.get('/api/departamentos')
  return data
}

export const createDepartamento = async (payload) => {
  const { data } = await api.post('/api/departamentos', payload)
  return data
}

export const updateDepartamento = async (id, payload) => {
  const { data } = await api.put(`/api/departamentos/${id}`, payload)
  return data
}

export const deleteDepartamento = async (id) => {
  const { data } = await api.delete(`/api/departamentos/${id}`)
  return data
}
