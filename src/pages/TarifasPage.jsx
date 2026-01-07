import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import ListaTarifas from '../components/ListaTarifas'
import ModalTarifa from '../components/ModalTarifa'
import ModalLocacion from '../components/ModalLocacion'
import ModalEditarCamion from '../components/ModalEditarCamion'
import { getTarifasPorCiudad, createTarifa } from '../api/tarifas.api'
import { getTiposCamion } from '../api/tiposCamion.api'
import { getDepartamentos } from '../api/departamentos.api'
import { getCiudadesPorDepartamento } from '../api/ciudades.api'

export default function TarifasPage() {
    // Exportar tarifas a Excel
    const exportarTarifasAExcel = () => {
      const rows = [];
      tarifasFiltradas.forEach(dep => {
        dep.ciudades.forEach(ciudad => {
          ciudad.tipos.forEach((tarifa, index) => {
            rows.push({
              'Departamento': dep.departamento,
              'Ciudad': ciudad.nombre,
              '# Opción': index + 1,
              'Tipo de Camión': tarifa.tipoCamion,
              'Descripción': tarifa.descripcion || 'Sin descripción',
              'Precio (COP)': tarifa.precio || 0
            });
          });
        });
      });
      const worksheet = XLSX.utils.json_to_sheet(rows);
      
      // Ajustar ancho de columnas automáticamente
      const columnWidths = [
        { wch: 20 }, // Departamento
        { wch: 20 }, // Ciudad
        { wch: 10 }, // # Opción
        { wch: 20 }, // Tipo de Camión
        { wch: 30 }, // Descripción
        { wch: 15 }  // Precio
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tarifas');
      XLSX.writeFile(workbook, 'tarifas.xlsx');
    }
  const [tarifas, setTarifas] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLocacionOpen, setModalLocacionOpen] = useState(false)
  const [filtroDepartamento, setFiltroDepartamento] = useState('')
  const [filtroCiudad, setFiltroCiudad] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalEditarCamionOpen, setModalEditarCamionOpen] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null); // Reiniciar el error antes de cargar datos

        const departamentosData = await getDepartamentos();
        setDepartamentos(departamentosData);

        const tiposCamion = await getTiposCamion();

        // Cargar ciudades y tarifas de cada departamento
        const tarifasAgrupadas = [];
        for (const dept of departamentosData) {
          const ciudadesData = await getCiudadesPorDepartamento(dept.id);
          for (const ciudad of ciudadesData) {
            const tarifasCiudad = await getTarifasPorCiudad(ciudad.id);
            let deptExistente = tarifasAgrupadas.find(d => d.departamento === dept.nombre);

            if (!deptExistente) {
              deptExistente = { departamento: dept.nombre, departamentoId: dept.id, ciudades: [] };
              tarifasAgrupadas.push(deptExistente);
            }

            if (tarifasCiudad && Array.isArray(tarifasCiudad) && tarifasCiudad.length > 0) {
              deptExistente.ciudades.push({
                nombre: ciudad.nombre,
                ciudadId: ciudad.id,
                tipos: tarifasCiudad.map(t => {
                  const tipo = tiposCamion.find(tc => tc.nombre === t.camion || tc.camion === t.camion);
                  return {
                    id: t.id,
                    tipoCamion: t.camion,
                    precio: t.tarifa,
                    descripcion: tipo ? tipo.descripcion : ''
                  };
                })
              });
            }
          }
        }

        setTarifas(tarifasAgrupadas);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    cargarDatos()
  }, [])

  // Cargar ciudades cuando cambia el departamento seleccionado
  useEffect(() => {
    const cargarCiudades = async () => {
      if (filtroDepartamento) {
        try {
          const ciudadesData = await getCiudadesPorDepartamento(filtroDepartamento)
          setCiudades(ciudadesData)
        } catch (err) {
          console.error('Error cargando ciudades:', err)
          setCiudades([])
        }
      } else {
        setCiudades([])
      }
    }

    cargarCiudades()
  }, [filtroDepartamento])

  // Filtrar datos dinámicamente
  const tarifasFiltradas = useMemo(() => {
    let resultado = [...tarifas]

    if (filtroDepartamento) {
      resultado = resultado.filter((dept) => dept.departamentoId === parseInt(filtroDepartamento))
    }

    if (filtroCiudad) {
      resultado = resultado.map((dept) => ({
        ...dept,
        ciudades: dept.ciudades.filter((ciudad) => ciudad.ciudadId === parseInt(filtroCiudad))
      }))
    }

    return resultado.filter((dept) => dept.ciudades.length > 0)
  }, [tarifas, filtroDepartamento, filtroCiudad])

  const handleSave = async (nuevaTarifa) => {
    try {
      await createTarifa({
        tipoCamion: nuevaTarifa.tipoCamion,
        precio: nuevaTarifa.precio,
        ciudadId: parseInt(nuevaTarifa.ciudad)
      })
      
      // Recargar datos
      const departamentosData = await getDepartamentos()
      const tarifasAgrupadas = []
      
      for (const dept of departamentosData) {
        const ciudadesData = await getCiudadesPorDepartamento(dept.id)
        
        for (const ciudad of ciudadesData) {
          const tarifasCiudad = await getTarifasPorCiudad(ciudad.id)
          
          let deptExistente = tarifasAgrupadas.find(d => d.departamento === dept.nombre)
          if (!deptExistente) {
            deptExistente = { departamento: dept.nombre, departamentoId: dept.id, ciudades: [] }
            tarifasAgrupadas.push(deptExistente)
          }

          if (tarifasCiudad && Array.isArray(tarifasCiudad) && tarifasCiudad.length > 0) {
            deptExistente.ciudades.push({
              nombre: ciudad.nombre,
              ciudadId: ciudad.id,
              tipos: tarifasCiudad.map(t => ({
                id: t.id,
                tipoCamion: t.tipoCamion,
                precio: t.precio
              }))
            })
          }
        }
      }

      setTarifas(tarifasAgrupadas)
      alert('Tarifa guardada exitosamente')
    } catch (err) {
      console.error('Error guardando tarifa:', err)
      alert('Error al guardar la tarifa')
    }
  }

  const listaDepartamentos = Array.isArray(departamentos) ? departamentos.map((d) => ({ id: d.id, nombre: d.nombre })) : [];
  const listaCiudades = Array.isArray(ciudades) ? ciudades.map((c) => ({ id: c.id, nombre: c.nombre })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tarifas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Corporativo */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tarifas</h1>
              <p className="text-gray-600 text-sm mt-1">Administra las tarifas de transporte por departamento y ciudad</p>
            </div>
            <div className="text-4xl">🚚</div>
          </div>
        </div>
      </header>


      <div className="max-w-6xl mx-auto p-6">
        {/* Barra de acciones principales */}
        <div className="flex flex-wrap gap-3 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm">
          <button
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md hover:shadow-lg"
            onClick={exportarTarifasAExcel}
            title="Descargar todas las tarifas en Excel con filtro automático"
          >
            <span className="text-lg">📥</span> Descargar Excel
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-md hover:shadow-lg"
            title="Crear una nueva tarifa"
          >
            <span className="text-lg">➕</span> Nueva Tarifa
          </button>
          <button
            onClick={() => setModalEditarCamionOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold shadow-md hover:shadow-lg"
            title="Editar tipos de camión disponibles"
          >
            <span className="text-lg">✏️</span> Editar Camiones
          </button>
          <button
            onClick={() => setModalLocacionOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-bold shadow-md hover:shadow-lg"
            title="Agregar una nueva ciudad o departamento"
          >
            <span className="text-lg">🏙️</span> Agregar Locación
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* ...existing filtro departamento... */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Departamento</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filtroDepartamento}
                onChange={(e) => {
                  setFiltroDepartamento(e.target.value)
                  setFiltroCiudad('')
                }}
              >
                <option value="">Todos</option>
                {listaDepartamentos.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>
            {/* ...existing filtro ciudad... */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Ciudad</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filtroCiudad}
                onChange={(e) => setFiltroCiudad(e.target.value)}
                disabled={!filtroDepartamento}
              >
                <option value="">Todas</option>
                {listaCiudades.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            {/* ...botón limpiar... */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroDepartamento('')
                  setFiltroCiudad('')
                }}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Tarifas */}
        <ListaTarifas tarifas={tarifasFiltradas} />

        <ModalTarifa
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          departamentos={listaDepartamentos}
          ciudades={listaCiudades}
          filtroDepartamento={filtroDepartamento}
        />
        {/* Modal para crear locaciones */}
        {modalLocacionOpen && (
          <ModalLocacion
            isOpen={modalLocacionOpen}
            onClose={() => setModalLocacionOpen(false)}
            onCreated={() => window.location.reload()}
            departamentos={listaDepartamentos}
          />
        )}
        {/* Modal para editar camiones */}
        <ModalEditarCamion
          isOpen={modalEditarCamionOpen}
          onClose={() => setModalEditarCamionOpen(false)}
        />
      </div>
    </div>
  )
}
