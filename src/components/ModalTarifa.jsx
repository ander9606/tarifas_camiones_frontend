import { useState, useEffect } from 'react'
import { getCiudadesPorDepartamento } from '../api/ciudades.api'
import { getTarifasPorCiudad } from '../api/tarifas.api'
import { getTiposCamion } from '../api/tiposCamion.api'

export default function ModalTarifa({ 
  isOpen, 
  onClose, 
  onSave, 
  departamentos = [],
  ciudades = [],
  filtroDepartamento = ''
}) {
  const [ciudadesDelDpto, setCiudadesDelDpto] = useState([])
  const [dpto, setDpto] = useState(filtroDepartamento || '')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('')
  const [tiposCamion, setTiposCamion] = useState([])
  const [tarifasExistentes, setTarifasExistentes] = useState([])
  const [precios, setPrecios] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dpto) {
      cargarCiudades()
    } else {
      setCiudadesDelDpto([])
    }
  }, [dpto])

  useEffect(() => {
    if (ciudadSeleccionada) {
      cargarTarifasYCamiones()
    } else {
      setTarifasExistentes([])
      setPrecios({})
    }
  }, [ciudadSeleccionada])

  const cargarCiudades = async () => {
    try {
      const data = await getCiudadesPorDepartamento(dpto)
      setCiudadesDelDpto(data)
    } catch (err) {
      console.error('Error cargando ciudades:', err)
    }
  }

  const cargarTarifasYCamiones = async () => {
    try {
      setLoading(true)
      const [tarifas, tipos] = await Promise.all([
        getTarifasPorCiudad(ciudadSeleccionada),
        getTiposCamion()
      ])
      setTarifasExistentes(tarifas)
      setTiposCamion(tipos)
      
      // Inicializar precios con los existentes
      const preciosIniciales = {}
      tarifas.forEach(tarifa => {
        preciosIniciales[tarifa.tipoCamionId] = tarifa.precio
      })
      setPrecios(preciosIniciales)
    } catch (err) {
      console.error('Error cargando tarifas y camiones:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePrecioChange = (tipoCamionId, valor) => {
    setPrecios(prev => ({
      ...prev,
      [tipoCamionId]: Number(valor)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Gestionar Tarifas</h2>
          <p className="text-blue-100 text-xs mt-1">Selecciona una ciudad y actualiza los precios de los camiones</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Departamento
              </label>
              <select
                value={dpto}
                onChange={(e) => {
                  setDpto(e.target.value)
                  setCiudadSeleccionada('')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un departamento</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Ciudad
              </label>
              <select
                value={ciudadSeleccionada}
                onChange={(e) => setCiudadSeleccionada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!dpto}
              >
                <option value="">Selecciona una ciudad</option>
                {ciudadesDelDpto.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8 text-gray-500">
              Cargando camiones...
            </div>
          )}

          {!loading && ciudadSeleccionada && tiposCamion.length > 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const tarifasAGuardar = tiposCamion.map(tipo => ({
                  tipoCamionId: tipo.id,
                  tipoCamion: tipo.nombre,
                  precio: precios[tipo.id] || 0,
                  ciudadId: ciudadSeleccionada
                }))
                onSave(tarifasAGuardar)
                onClose()
              }}
            >
              <div className="mb-6 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Precios por Camión</h3>
                <div className="space-y-3">
                  {tiposCamion.map(tipo => {
                    const tarifaExistente = tarifasExistentes.find(t => t.tipoCamionId === tipo.id)
                    return (
                      <div key={tipo.id} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{tipo.nombre}</p>
                          <p className="text-xs text-gray-500">{tipo.descripcion || 'Sin descripción'}</p>
                        </div>
                        <input
                          type="number"
                          value={precios[tipo.id] || ''}
                          onChange={(e) => handlePrecioChange(tipo.id, e.target.value)}
                          placeholder="Precio"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <span className="text-xs text-gray-500 w-20">COP</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm"
                >
                  Guardar Tarifas
                </button>
              </div>
            </form>
          )}

          {!loading && ciudadSeleccionada && tiposCamion.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay camiones registrados
            </div>
          )}

          {!ciudadSeleccionada && !loading && (
            <div className="text-center py-8 text-gray-400">
              Selecciona un departamento y una ciudad para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
