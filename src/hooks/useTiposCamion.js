import { useEffect, useState } from 'react'
import { getTiposCamion } from '../api/tiposCamion.api'

export function useTiposCamion() {
  const [tiposCamion, setTiposCamion] = useState([])
  const [loading, setLoading] = useState(false)

 useEffect(() => {
  let active = true

  const cargar = async () => {
    setLoading(true)
    const data = await getTiposCamion()
    if (active) {
      setTiposCamion(data)
      setLoading(false)
    }
  }

  cargar()
  return () => { active = false }
}, [])


  return { tiposCamion, loading }
}
