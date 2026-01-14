import { useState } from 'react'
import { useDepartamentos } from '../hooks/useDepartamentos'
import { useCiudades } from '../hooks/useCiudades'
import { MdExpandMore, MdExpandLess, MdDelete, MdLocationCity, MdAdd } from 'react-icons/md'

export default function ListaDepartamentos() {
  const { departamentos, loading: loadingDepts, error: errorDepts, eliminar: eliminarDept, crear: crearDept } = useDepartamentos()
  const { ciudades, loading: loadingCiudades, cargarCiudades, crear: crearCiudad, eliminar: eliminarCiudad } = useCiudades()
  const [expandedDeptId, setExpandedDeptId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDeptId, setSelectedDeptId] = useState(null)
  const [nuevaCiudadNombre, setNuevaCiudadNombre] = useState('')
  const [creatingCity, setCreatingCity] = useState(false)
  const [modalAgregarDeptOpen, setModalAgregarDeptOpen] = useState(false)
  const [nuevoDeptNombre, setNuevoDeptNombre] = useState('')
  const [creatingDept, setCreatingDept] = useState(false)

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

  const handleAbrirModalAgregar = (deptId) => {
    setSelectedDeptId(deptId)
    setNuevaCiudadNombre('')
    setModalOpen(true)
  }

  const handleCrearCiudad = async () => {
    if (!nuevaCiudadNombre.trim()) {
      alert('Por favor ingresa el nombre de la ciudad')
      return
    }

    try {
      setCreatingCity(true)
      await crearCiudad({
        nombre: nuevaCiudadNombre,
        departamentoId: selectedDeptId
      })
      setModalOpen(false)
      setNuevaCiudadNombre('')
      await cargarCiudades(selectedDeptId)
    } catch (err) {
      console.error(err)
      alert('Error al crear la ciudad')
    } finally {
      setCreatingCity(false)
    }
  }

  const handleAbrirModalAgregarDept = () => {
    setNuevoDeptNombre('')
    setModalAgregarDeptOpen(true)
  }

  const handleCrearDepartamento = async () => {
    if (!nuevoDeptNombre.trim()) {
      alert('Por favor ingresa el nombre del departamento')
      return
    }

    try {
      setCreatingDept(true)
      await crearDept({
        nombre: nuevoDeptNombre
      })
      setModalAgregarDeptOpen(false)
      setNuevoDeptNombre('')
    } catch (err) {
      console.error(err)
      alert('Error al crear el departamento')
    } finally {
      setCreatingDept(false)
    }
  }

  if (loadingDepts) return <div className="p-4">Cargando departamentos...</div>
  if (errorDepts) return <div className="p-4 text-red-600">{errorDepts}</div>

  return (
    <div className="space-y-6">
      {/* Botón para agregar departamento */}
      <div className="flex justify-end">
        <button
          onClick={handleAbrirModalAgregarDept}
          className="px-6 py-3 bg-primary hover:bg-blue-500 text-slate-900 font-semibold rounded-lg transition flex items-center gap-2 shadow-md"
        >
          <MdAdd size={20} />
          Agregar Departamento
        </button>
      </div>

      {departamentos.map((dept) => (
        <div key={dept.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Header del Departamento */}
          <div className="bg-primary p-6 text-slate-900 flex items-center justify-between hover:bg-blue-500 transition">
            <button
              onClick={() => handleToggleDepartamento(dept.id)}
              className="flex-1 text-left flex items-center gap-3"
            >
              <span>
                {expandedDeptId === dept.id ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
              </span>
              <div>
                <h3 className="font-bold text-xl text-slate-900">{dept.nombre}</h3>
                <p className="text-slate-700 text-sm">{ciudades.length} ciudades</p>
              </div>
            </button>
            <button
              onClick={() => handleEliminarDepartamento(dept.id)}
              disabled={deletingId === dept.id}
              className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:bg-gray-400 flex items-center gap-2"
            >
              <MdDelete />
              {deletingId === dept.id ? 'Eliminando...' : 'Eliminar'}
            </button>
            <button
              onClick={() => handleAbrirModalAgregar(dept.id)}
              className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <MdAdd />
              Agregar Ciudad
            </button>
          </div>

          {/* Ciudades del Departamento */}
          {expandedDeptId === dept.id && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800">
              {loadingCiudades ? (
                <p className="text-slate-600">Cargando ciudades...</p>
              ) : ciudades.length === 0 ? (
                <p className="text-slate-600">No hay ciudades en este departamento</p>
              ) : (
                <div className="space-y-3">
                  {ciudades.map((ciudad) => (
                    <div
                      key={ciudad.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                          <MdLocationCity className="text-slate-400" size={20} />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{ciudad.nombre}</span>
                      </div>
                      <button
                        onClick={() => handleEliminarCiudad(ciudad.id)}
                        disabled={deletingId === ciudad.id}
                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:bg-gray-400 flex items-center gap-1"
                      >
                        <MdDelete size={16} />
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

      {/* Modal para agregar ciudad */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Agregar Nueva Ciudad</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nombre de la ciudad
              </label>
              <input
                type="text"
                value={nuevaCiudadNombre}
                onChange={(e) => setNuevaCiudadNombre(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCrearCiudad()}
                placeholder="Ej: Medellín"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                disabled={creatingCity}
                className="px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearCiudad}
                disabled={creatingCity}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition disabled:bg-gray-400 flex items-center gap-2"
              >
                <MdAdd />
                {creatingCity ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar departamento */}
      {modalAgregarDeptOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Agregar Nuevo Departamento</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nombre del departamento
              </label>
              <input
                type="text"
                value={nuevoDeptNombre}
                onChange={(e) => setNuevoDeptNombre(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCrearDepartamento()}
                placeholder="Ej: Antioquia"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalAgregarDeptOpen(false)}
                disabled={creatingDept}
                className="px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearDepartamento}
                disabled={creatingDept}
                className="px-6 py-2 bg-primary hover:bg-blue-500 text-slate-900 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center gap-2"
              >
                <MdAdd />
                {creatingDept ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
