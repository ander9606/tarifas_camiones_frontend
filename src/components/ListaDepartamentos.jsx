import { useState } from 'react'
import { useDepartamentos } from '../hooks/useDepartamentos'
import { useCiudades } from '../hooks/useCiudades'

export default function ListaDepartamentos() {
  const { departamentos, loading: loadingDepts, error: errorDepts, eliminar: eliminarDept } = useDepartamentos()
  const { ciudades, loading: loadingCiudades, cargarCiudades, eliminar: eliminarCiudad } = useCiudades()
  const [expandedDeptId, setExpandedDeptId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleToggleDepartamento = async (deptId) => {
    if (expandedDeptId === deptId) {
      setExpandedDeptId(null)
    } else {
      setExpandedDeptId(deptId)
      await cargarCiudades(deptId)
    }
  }

  const handleEliminarDepartamento = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      try {
        setDeletingId(id)
        await eliminarDept(id)
      } catch (err) {
        console.error(err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleEliminarCiudad = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ciudad?')) {
      try {
        setDeletingId(id)
        await eliminarCiudad(id)
      } catch (err) {
        console.error(err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loadingDepts) return <div className="p-4">Cargando departamentos...</div>
  if (errorDepts) return <div className="p-4 text-red-600">{errorDepts}</div>

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Departamentos y Ciudades</h2>

      <div className="space-y-4">
        {departamentos.map((dept) => (
          <div key={dept.id} className="border rounded-lg overflow-hidden">
            {/* Header del Departamento */}
            <div className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition">
              <button
                onClick={() => handleToggleDepartamento(dept.id)}
                className="flex-1 text-left font-semibold text-gray-800 hover:text-gray-900"
              >
                <span className="inline-block mr-2">
                  {expandedDeptId === dept.id ? '▼' : '▶'}
                </span>
                {dept.nombre}
              </button>
              <button
                onClick={() => handleEliminarDepartamento(dept.id)}
                disabled={deletingId === dept.id}
                className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition disabled:bg-gray-400"
              >
                {deletingId === dept.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>

            {/* Ciudades del Departamento */}
            {expandedDeptId === dept.id && (
              <div className="bg-gray-50 p-4 border-t">
                {loadingCiudades ? (
                  <p className="text-gray-600">Cargando ciudades...</p>
                ) : ciudades.length === 0 ? (
                  <p className="text-gray-600">No hay ciudades en este departamento</p>
                ) : (
                  <div className="space-y-2">
                    {ciudades.map((ciudad) => (
                      <div
                        key={ciudad.id}
                        className="flex items-center justify-between p-3 bg-white border rounded hover:bg-gray-100 transition"
                      >
                        <span className="text-gray-800 ml-6">{ciudad.nombre}</span>
                        <button
                          onClick={() => handleEliminarCiudad(ciudad.id)}
                          disabled={deletingId === ciudad.id}
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium transition disabled:bg-gray-400"
                        >
                          {deletingId === ciudad.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
