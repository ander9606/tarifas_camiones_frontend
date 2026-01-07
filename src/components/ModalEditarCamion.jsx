import { useState, useEffect } from 'react'
import { getTiposCamion, updateTipoCamion } from '../api/tiposCamion.api'

export default function ModalEditarCamion({ isOpen, onClose }) {
  const [tipos, setTipos] = useState([])
  const [editId, setEditId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      getTiposCamion().then(setTipos)
    }
  }, [isOpen])

  const handleEdit = (tipo) => {
    setEditId(tipo.id)
    setNombre(tipo.nombre || tipo.camion || '')
    setDescripcion(tipo.descripcion || '')
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      await updateTipoCamion(editId, { nombre, descripcion })
      setEditId(null)
      setNombre('')
      setDescripcion('')
      setTipos(await getTiposCamion())
    } catch {
      setError('Error al guardar cambios')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Editar Camiones</h2>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {tipos.map(tipo => (
            <div key={tipo.id} className="border rounded p-3 flex flex-col gap-2 bg-gray-50">
              {editId === tipo.id ? (
                <>
                  <input
                    className="border px-2 py-1 rounded mb-1"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Nombre"
                    disabled={loading}
                  />
                  <input
                    className="border px-2 py-1 rounded mb-1 text-sm"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                    disabled={loading}
                  />
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={handleSave} disabled={loading || !nombre}>Guardar</button>
                    <button className="border px-3 py-1 rounded text-sm" onClick={() => setEditId(null)} disabled={loading}>Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{tipo.nombre || tipo.camion}</span>
                    <button className="text-blue-600 text-xs underline" onClick={() => handleEdit(tipo)}>Editar</button>
                  </div>
                  <span className="text-xs text-gray-500">{tipo.descripcion || 'Sin descripción'}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium" onClick={onClose} disabled={loading}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
