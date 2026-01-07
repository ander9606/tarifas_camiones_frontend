import { useState } from 'react'
import { createDepartamento } from '../api/departamentos.api'
import { createCiudad } from '../api/ciudades.api'

export default function ModalLocacion({ isOpen, onClose, onCreated, departamentos }) {
  const [nombreDepartamento, setNombreDepartamento] = useState('')
  const [nombreCiudad, setNombreCiudad] = useState('')
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCrearDepartamento = async () => {
    setLoading(true)
    setError(null)
    try {
      await createDepartamento({ nombre: nombreDepartamento })
      setNombreDepartamento('')
      onCreated && onCreated()
      onClose()
    } catch {
      setError('Error al crear departamento')
    } finally {
      setLoading(false)
    }
  }

  const handleCrearCiudad = async () => {
    setLoading(true)
    setError(null)
    try {
      await createCiudad({ nombre: nombreCiudad, departamentoId: departamentoSeleccionado })
      setNombreCiudad('')
      setDepartamentoSeleccionado('')
      onCreated && onCreated()
      onClose()
    } catch {
      setError('Error al crear ciudad')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Crear Nueva Locación</h2>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Nuevo Departamento</h3>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Nombre del departamento"
            value={nombreDepartamento}
            onChange={e => setNombreDepartamento(e.target.value)}
            disabled={loading}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            onClick={handleCrearDepartamento}
            disabled={loading || !nombreDepartamento}
          >
            Crear Departamento
          </button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Nueva Ciudad</h3>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            value={departamentoSeleccionado}
            onChange={e => setDepartamentoSeleccionado(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Nombre de la ciudad"
            value={nombreCiudad}
            onChange={e => setNombreCiudad(e.target.value)}
            disabled={loading || !departamentoSeleccionado}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
            onClick={handleCrearCiudad}
            disabled={loading || !nombreCiudad || !departamentoSeleccionado}
          >
            Crear Ciudad
          </button>
        </div>
        <button
          className="mt-6 w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
