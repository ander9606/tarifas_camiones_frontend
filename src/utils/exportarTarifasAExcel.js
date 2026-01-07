import * as XLSX from 'xlsx';

export function exportarTarifasAExcel(tarifas) {
  // Crear datos para la hoja principal
  const rows = [];
  tarifas.forEach(dep => {
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

  // Crear hoja de búsqueda con instrucciones
  const searchRows = [
    { 'Instrucciones': 'Ve a la hoja "Tarifas" y usa el filtro automático en la columna "Ciudad"' },
    { 'Instrucciones': '' },
    { 'Instrucciones': '1. Abre la hoja "Tarifas"' },
    { 'Instrucciones': '2. Haz clic en el botón de filtro (pequeña flecha) en el encabezado "Ciudad"' },
    { 'Instrucciones': '3. Selecciona o escribe la ciudad que buscas' },
    { 'Instrucciones': '4. Verás automáticamente las 3 opciones de camión para esa ciudad' }
  ];

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const searchWorksheet = XLSX.utils.json_to_sheet(searchRows);

  // Habilitar filtro automático en la hoja Tarifas
  worksheet['!autofilter'] = { ref: `A1:F${rows.length + 1}` };

  // Configurar ancho de columnas para la hoja principal
  const columnWidths = [
    { wch: 20 }, // Departamento
    { wch: 20 }, // Ciudad
    { wch: 10 }, // # Opción
    { wch: 20 }, // Tipo de Camión
    { wch: 30 }, // Descripción
    { wch: 15 }  // Precio
  ];
  worksheet['!cols'] = columnWidths;

  // Configurar ancho de columnas para la hoja de búsqueda
  const searchColumnWidths = [
    { wch: 80 }
  ];
  searchWorksheet['!cols'] = searchColumnWidths;

  // Crear workbook con ambas hojas
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, searchWorksheet, 'Búsqueda');
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tarifas');
  XLSX.writeFile(workbook, 'tarifas.xlsx');
}
