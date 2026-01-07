import { useState, useEffect } from 'react'
import { getCiudadesPorDepartamento } from '../api/ciudades.api'

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

  useEffect(() => {
    if (dpto) {
      cargarCiudades()
    } else {
      setCiudadesDelDpto([])
    }
  }, [dpto])

  const cargarCiudades = async () => {
    try {
      const data = await getCiudadesPorDepartamento(dpto)
      setCiudadesDelDpto(data)
    } catch (err) {
      console.error('Error cargando ciudades:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Nueva Tarifa</h2>
          <p className="text-blue-100 text-xs mt-1">Completa los datos para registrar una tarifa</p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const data = {
              tipoCamion: e.target.tipoCamion.value,
              precio: Number(e.target.precio.value),
              ciudad: e.target.ciudad.value
            }
            onSave(data)
            onClose()
            e.target.reset()
            setDpto('')
          }}
          className="p-6"
        >
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
              Departamento
            </label>
            <select
              value={dpto}
              onChange={(e) => setDpto(e.target.value)}
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

          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
              Ciudad
            </label>
            <select
              name="ciudad"
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

          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
              Tipo de Camión
            </label>
            <input
              name="tipoCamion"
              type="text"
              placeholder="Ej: Camión pequeño"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
              Precio (COP)
            </label>
            <input
              name="precio"
              type="number"
              placeholder="Ej: 150000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
