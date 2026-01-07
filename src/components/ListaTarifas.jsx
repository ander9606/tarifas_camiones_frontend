import TarifaItem from './TarifaItem'

export default function ListaTarifas({ tarifas }) {
  if (tarifas.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-base font-medium">No hay tarifas disponibles</p>
        <p className="text-gray-400 text-sm mt-1">Ajusta los filtros o agrega nuevas tarifas</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tarifas.map((dep) => (
        <div key={dep.departamento} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header del Departamento */}
          <div className="bg-blue-600 text-white px-6 py-4 border-l-4 border-blue-700">
            <h2 className="text-lg font-semibold">{dep.departamento}</h2>
            <p className="text-blue-100 text-xs mt-1">{dep.ciudades.length} ciudad{dep.ciudades.length !== 1 ? 'es' : ''}</p>
          </div>

          {/* Ciudades */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dep.ciudades.map((ciudad) => (
                <div
                  key={ciudad.nombre}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {/* Header de la ciudad */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">{ciudad.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-1">{ciudad.tipos.length} tipo{ciudad.tipos.length !== 1 ? 's' : ''} de camión</p>
                  </div>

                  {/* Lista de tarifas */}
                    <div className="divide-y divide-gray-100">
                      {ciudad.tipos.map((tipo, index) => (
                        <TarifaItem
                          key={tipo.id || `${ciudad.ciudadId}-${index}`}
                          tipoCamion={tipo.tipoCamion}
                          precio={tipo.precio}
                          descripcion={tipo.descripcion}
                        />
                      ))}
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
