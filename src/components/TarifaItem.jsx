export default function TarifaItem({ tipoCamion, precio, descripcion }) {
  const formattedPrecio = typeof precio === 'number' ? precio.toLocaleString('es-CO') : 'N/A';
  return (
    <div className="flex justify-between items-center px-4 py-3 hover:bg-blue-50 transition">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600">🚛</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-800 block">{tipoCamion}</span>
          {descripcion && (
            <span className="text-xs text-gray-500 block mt-0.5">{descripcion}</span>
          )}
        </div>
      </div>
      <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm">
        {formattedPrecio}
      </span>
    </div>
  )
}
