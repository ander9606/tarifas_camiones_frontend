import api from './axios'

export const getDepartamentos = async () => {
  const { data } = await api.get('/departamentos')
  return data
}

export const createDepartamento = async (payload) => {
  const { data } = await api.post('/departamentos', payload)
  return data
}

export const updateDepartamento = async (id, payload) => {
  const { data } = await api.put(`/departamentos/${id}`, payload)
  return data
}

export const deleteDepartamento = async (id) => {
  const { data } = await api.delete(`/departamentos/${id}`)
  return data
}
