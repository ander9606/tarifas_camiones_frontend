import { getTiposCamion } from '../api/tiposCamion.api'

export async function obtenerDescripcionCamion(nombreCamion) {
  const tipos = await getTiposCamion()
  const tipo = tipos.find(t => t.nombre === nombreCamion || t.camion === nombreCamion)
  return tipo ? tipo.descripcion : ''
}
