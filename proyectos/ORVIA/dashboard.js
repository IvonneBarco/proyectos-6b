const ROOT = './'
const pageKey = document.body.dataset.page || 'overview'

const pages = [
  { key: 'overview', label: 'Panel ejecutivo', group: 'GENERAL', icon: '◫', file: 'dashboard.html' },
  { key: 'finance', label: 'Finanzas y contabilidad', group: 'GESTIÓN', icon: '$', file: 'finanzas.html' },
  { key: 'plant', label: 'Planta de trituración', group: 'OPERACIONES', icon: '▤', file: 'planta.html' },
  { key: 'fleet', label: 'Flota y taller', group: 'OPERACIONES', icon: '▰', file: 'flota.html' },
  { key: 'inventory', label: 'Inventarios y repuestos', group: 'OPERACIONES', icon: '▦', file: 'inventario.html' },
  { key: 'security', label: 'Perfil y seguridad', group: 'SISTEMA', icon: '◇', file: 'seguridad.html' },
]

const transactions = [
  { date: '06 oct 2026', description: 'Pago proveedores · Cementos Argos', amount: '$2.500M', status: 'Pagado' },
  { date: '05 oct 2026', description: 'Cobro factura 1204 · Infraestructura Vial', amount: '$4.100M', status: 'Pagado' },
  { date: '05 oct 2026', description: 'Pago proveedores · Repuestos Komatsu', amount: '$1.840M', status: 'Pendiente' },
  { date: '04 oct 2026', description: 'Cobro contrato · Cantera Norte', amount: '$3.200M', status: 'Pendiente' },
  { date: '03 oct 2026', description: 'Nómina operativa · Planta A', amount: '$920M', status: 'Pagado' },
]

const dispatches = [
  ['Grava 3/4"', '32.5', 'T-104', '10:45 AM'],
  ['Arena fina', '28.0', 'T-112', '10:30 AM'],
  ['Piedra base', '45.0', 'T-201', '10:15 AM'],
  ['Grava 1/2"', '30.0', 'T-008', '09:55 AM'],
  ['Arena gruesa', '25.0', 'T-017', '09:40 AM'],
]

const inventory = [
  { name: 'Tornillos de alta resistencia', sku: '52001001', category: 'Repuestos', stock: 500, unit: 'u', reorder: 160, value: '$2.5M' },
  { name: 'Tuercas de 1 pulgada', sku: '52001002', category: 'Repuestos', stock: 400, unit: 'u', reorder: 120, value: '$1.2M' },
  { name: 'Aceite hidráulico SAE 68', sku: '52067201', category: 'Lubricantes', stock: 200, unit: 'L', reorder: 250, value: '$5.4M' },
  { name: 'Filtro de aire EX-101', sku: '52087406', category: 'Repuestos', stock: 150, unit: 'u', reorder: 100, value: '$1.8M' },
  { name: 'Grasa multipropósito', sku: '53002117', category: 'Lubricantes', stock: 82, unit: 'kg', reorder: 90, value: '$960K' },
  { name: 'Manguera de alta presión', sku: '53004419', category: 'Suministros', stock: 34, unit: 'u', reorder: 40, value: '$3.1M' },
]

const fleet = [
  { id: 'EX-101', name: 'Excavadora EX-101', status: 'Operativo', location: 'Cantera Norte', usage: '8.4 h hoy', symbol: '⚒' },
  { id: 'VQ-205', name: 'Volqueta VQ-205', status: 'En taller', location: 'Taller central', usage: 'Ingreso 14 may', symbol: '▰' },
  { id: 'EX-103', name: 'Excavadora EX-103', status: 'Preventivo', location: 'Planta A', usage: 'Servicio en 12 h', symbol: '⚒' },
  { id: 'VQ-207', name: 'Volqueta VQ-207', status: 'Operativo', location: 'Taller central', usage: '8.1 h hoy', symbol: '▰' },
]

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function badge(status) {
  const className = status === 'Pagado' || status === 'Operativo' || status === 'ACTIVA' ? 'status' : status === 'En taller' || status === 'Reordenar' || status === 'PENDIENTE' || status === 'Servicio' ? 'status status-warn' : 'status status-muted'
  return `<span class="${className}">${escapeHTML(status)}</span>`
}

function metric(label, value, detail, symbol, tone = 'green') {
  return `<article class="metric metric-${tone}"><div class="metric-label"><span>${label}</span><span class="metric-icon">${symbol}</span></div><strong>${value}</strong><small>${detail}</small></article>`
}

function pageHeading(eyebrow, title, description, action = '') {
  return `<header class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${action}</header>`
}

function surfaceTitle(title, subtitle, action = '') {
  return `<div class="surface-heading"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${action}</div>`
}

function table(headers, rows) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td colspan="${headers.length}" class="table-empty">No hay registros para este filtro.</td></tr>`}</tbody></table></div>`
}

function chartSVG() {
  return `<div class="chart" role="img" aria-label="Gráfico de ingresos y gastos entre enero y julio"><svg viewBox="0 0 680 245" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10b981" stop-opacity=".32"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs>
    <path class="chart-grid" d="M55 35H670M55 80H670M55 125H670M55 170H670M55 215H670"/>
    <path class="chart-area" d="M56 198 C91 176 99 155 145 163 S201 170 235 140 S288 118 324 132 S374 89 416 96 S474 126 512 118 S572 68 615 78 S651 48 670 36 V215 H56Z"/>
    <path class="chart-income" d="M56 198 C91 176 99 155 145 163 S201 170 235 140 S288 118 324 132 S374 89 416 96 S474 126 512 118 S572 68 615 78 S651 48 670 36"/>
    <path class="chart-expense" d="M56 211 C96 197 111 180 145 185 S201 191 235 170 S288 156 324 168 S374 138 416 146 S474 169 512 158 S572 122 615 135 S650 104 670 97"/>
    <text class="chart-label" x="55" y="238">Ene</text><text class="chart-label" x="151" y="238">Feb</text><text class="chart-label" x="248" y="238">Mar</text><text class="chart-label" x="345" y="238">Abr</text><text class="chart-label" x="442" y="238">May</text><text class="chart-label" x="539" y="238">Jun</text><text class="chart-label" x="643" y="238">Jul</text>
    <text class="chart-label" x="4" y="38">$240M</text><text class="chart-label" x="7" y="83">$180M</text><text class="chart-label" x="7" y="128">$120M</text><text class="chart-label" x="16" y="173">$60M</text><text class="chart-label" x="31" y="218">$0</text>
  </svg></div>`
}

function businessChart() {
  const bars = [
    { label: 'Infra.', primary: 58, secondary: 31 },
    { label: 'Materiales', primary: 86, secondary: 50 },
    { label: 'Bienes raíz', primary: 41, secondary: 25 },
    { label: 'Energía', primary: 73, secondary: 42 },
  ]
  return `<div class="business-bars">${bars.map((item) => `<div class="bar-set"><span class="bar" style="height:${item.primary}%" title="Beneficio ${item.primary / 10}%"></span><span class="bar secondary" style="height:${item.secondary}%" title="Rentabilidad ${item.secondary / 10}%"></span></div>`).join('')}</div><div class="bar-labels">${bars.map((item) => `<span>${item.label}</span>`).join('')}</div>`
}

function overviewPage() {
  return `${pageHeading('ORVIA / ANALÍTICA', 'Panel de Control Ejecutivo', 'Indicadores consolidados · Actualizado hace 2 min', '<span class="live-badge"><i class="live-dot"></i> Operaciones en vivo</span>')}
    <section class="metrics">${metric('Ventas de hoy', '$4.800M', 'COP · Consolidado', '↗')}${metric('Ingresos mensuales', '$138.000M', 'COP · Octubre', '$')}${metric('Producción diaria', '2,500 ton', 'Meta diaria 3,000 ton', '◉', 'neutral')}${metric('Proyectos activos', '45', '6 unidades de negocio', '▦', 'purple')}</section>
    <div class="dashboard-grid">
      <section class="surface revenue-panel">${surfaceTitle('Ingresos vs. Gastos (YTD)', 'COP · Millones', '<select class="select-control" aria-label="Seleccionar periodo"><option>YTD</option><option>Últimos 90 días</option><option>Últimos 30 días</option></select>')}${chartSVG()}<div class="legend-row"><span><i class="legend-chip"><i></i>Ingresos</i><i class="legend-chip purple"><i></i>Gastos</i></span><span>Valores expresados en COP</span></div></section>
      <section class="surface business-panel">${surfaceTitle('Beneficio por unidad', 'Margen operativo · %')}${businessChart()}<div class="legend-row"><span><i class="legend-chip"><i></i>Beneficio</i><i class="legend-chip purple"><i></i>Rentabilidad</i></span><span>Consolidado</span></div></section>
      <section class="surface operations-panel">${surfaceTitle('Operaciones en vivo', 'Resumen de planta y flota', '<a class="secondary" href="flota.html">Ver flota →</a>')}
        <div class="fleet-summary"><div class="fleet-summary-title"><span>▰</span><div><strong>Resumen de flota</strong><small>100 unidades monitoreadas</small></div></div><div class="fleet-counts"><div><span>Operando</span><strong>85</strong></div><div class="maintenance"><span>Mantenimiento</span><strong>12</strong></div><div><span>Disponibles</span><strong>3</strong></div></div></div>
        <div class="operation-row"><span class="operation-icon">▤</span><div class="operation-copy"><span>Actividad de planta</span><strong>Planta A · 89.8%</strong></div>${badge('Estable')}</div>
        <div class="operation-row"><span class="operation-icon">⚒</span><div class="operation-copy"><span>Estado del equipo</span><strong>Excavadora EX-103</strong></div>${badge('Servicio')}</div>
      </section>
    </div>`
}

function transactionRows(filter = 'Todos', query = '') {
  const normalized = query.trim().toLowerCase()
  return transactions.filter((item) => (filter === 'Todos' || item.status === filter) && `${item.date} ${item.description} ${item.status}`.toLowerCase().includes(normalized)).map((item) => `<tr data-transaction data-status="${item.status}" data-search="${escapeHTML(`${item.date} ${item.description} ${item.status}`.toLowerCase())}"><td>${item.date}</td><td>${item.description}</td><td>${item.amount}</td><td>${badge(item.status)}</td><td><button class="icon-button row-menu" aria-label="Ver transacción" data-detail="${escapeHTML(item.description)}">···</button></td></tr>`).join('')
}

function financePage() {
  return `${pageHeading('FINANZAS / COP', 'Finanzas y contabilidad', 'Posición financiera consolidada · Corte al 06 oct 2026', '<button class="secondary" data-action="export-csv">⇩ Exportar reporte</button>')}
    <section class="metrics">${metric('Utilidad neta del mes', '$8.400M', '+12.5% vs. mes anterior', '↗')}${metric('EBITDA', '$14.200M', 'Margen EBITDA 18.4%', '▥', 'purple')}${metric('Cuentas por cobrar', '$25.100M', '38 facturas abiertas', '↓', 'neutral')}${metric('Cuentas por pagar', '$18.600M', '21 pagos programados', '↑')}</section>
    <section class="surface">${surfaceTitle('Transacciones recientes de alto valor', 'Movimientos superiores a $500M COP', '<button class="primary" data-action="new-transaction">＋ Nueva transacción</button>')}
      <div class="table-toolbar"><div class="filters" role="group" aria-label="Filtrar transacciones"><button class="filter-button active" data-status-filter="Todos">Todos</button><button class="filter-button" data-status-filter="Pagado">Pagado</button><button class="filter-button" data-status-filter="Pendiente">Pendiente</button></div><span class="table-count" data-table-count></span></div>
      <div data-transaction-table>${table(['Fecha', 'Descripción', 'Monto', 'Estado', ''], transactionRows())}</div>
      <div class="table-footer"><span>Vista de demostración · 5 transacciones</span><button class="text-button" data-action="toast" data-message="Mostrando todos los movimientos de alto valor">Ver todas →</button></div>
    </section>
    <div class="page-grid-two"><section class="surface">${surfaceTitle('Flujo de caja (YTD)', 'Entradas y salidas · COP millones')}${chartSVG()}</section><section class="surface">${surfaceTitle('Cuentas por cobrar', 'Distribución de cartera · COP')}<div class="receivable-wrap"><div class="donut"><span>$25.1B</span></div><div class="receivable-legend"><span><i></i> Vigente <b>62%</b></span><span><i class="violet"></i> 1-30 días <b>23%</b></span><span><i class="gray"></i> Más de 30 días <b>15%</b></span></div></div></section></div>`
}

function plantPage() {
  const lines = ['Trituradora primaria', 'Cinta transportadora', 'Trituradora secundaria']
  return `${pageHeading('UNIDADES DE NEGOCIO / MATERIALES', 'Planta de trituración', 'Planta A · Cantera Norte · Turno diurno', '<span class="live-badge"><i class="live-dot"></i> Datos en vivo</span>')}
    <section class="metrics three-metrics">${metric('Tonelaje total hoy', '12,500 ton', 'Meta diaria 14,000 ton', '◉')}${metric('Consumo energético', '4,200 kWh', '3.2% vs. promedio', 'ϟ', 'neutral')}${metric('Eficiencia de trituración', '92%', 'Condición óptima', '↗', 'purple')}</section>
    <section class="surface">${surfaceTitle('Estado de línea de producción', 'Pulsa una línea para cambiar su estado de demostración')}<div class="production-lines">${lines.map((line, index) => `<button class="line-button ${index < 2 ? 'running' : 'stopped'}" data-line-toggle aria-pressed="${index < 2}"><i class="line-light"></i><span class="line-copy"><strong>${line}</strong><small>${index < 2 ? `Activa · ${index === 0 ? '98%' : '95%'} disponibilidad` : 'En espera · sin producción'}</small></span><span class="line-state">${index < 2 ? 'ACTIVA' : 'DETENIDA'}</span></button>`).join('')}</div></section>
    <section class="surface">${surfaceTitle('Últimos despachos', 'Salidas registradas desde Planta A', '<button class="secondary" data-action="toast" data-message="Registro de despacho actualizado">▤ Ver registro</button>')}${table(['Material', 'Toneladas', 'ID camión', 'Hora'], dispatches.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td class="mono">${row[2]}</td><td>${row[3]}</td></tr>`).join(''))}</section>`
}

function fleetPage() {
  return `${pageHeading('OPERACIONES / ACTIVOS', 'Gestión de flota y taller', 'Estado de vehículos, consumo y mantenimiento preventivo', '<select class="select-control" data-fleet-filter aria-label="Filtrar vehículos"><option>Todos</option><option>Operativo</option><option>En taller</option><option>Preventivo</option></select>')}
    <div class="fleet-grid">${fleet.map((vehicle) => `<button class="vehicle-card" data-vehicle-card data-status="${vehicle.status}" data-vehicle="${vehicle.id}"><span class="vehicle-head"><small class="vehicle-id">${vehicle.id}</small>${badge(vehicle.status)}</span><span class="vehicle-image" aria-hidden="true">${vehicle.symbol}</span><strong>${vehicle.name}</strong><span class="vehicle-meta"><span>⌖ ${vehicle.location}</span><span>◷ ${vehicle.usage}</span></span></button>`).join('')}</div>
    <div class="detail-note" data-vehicle-note hidden><span>Vehículo seleccionado: <strong data-selected-vehicle></strong></span><button class="text-button" data-action="clear-vehicle">Limpiar</button></div>
    <div class="page-grid-two"><section class="surface">${surfaceTitle('Consumo de combustible', 'Registros de abastecimiento')} ${table(['Vehículo', 'Fecha', 'Litros', 'Costo', 'Rendimiento'], [['VQ-205','05 oct 2026','150 L','$180.000','2.5 km/L'],['VQ-207','05 oct 2026','144 L','$173.000','2.8 km/L'],['EX-101','04 oct 2026','200 L','$240.000','N/A']].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join(''))}</section>
    <section class="surface">${surfaceTitle('Alertas de mantenimiento', '2 tareas requieren seguimiento')}<div class="alert-row"><span class="alert-icon">!</span><span class="alert-copy"><strong>Excavadora EX-101</strong><small>Cambio de aceite · 500 horas cumplidas</small></span><button class="text-button" data-action="resolve-alert">Atender</button></div><div class="alert-row"><span class="alert-icon">⚒</span><span class="alert-copy"><strong>Volqueta VQ-202</strong><small>Rotación de neumáticos recomendada</small></span><button class="text-button" data-action="resolve-alert">Atender</button></div></section></div>`
}

function inventoryRows(search = '', alertsOnly = false) {
  const query = search.trim().toLowerCase()
  return inventory.filter((item) => (!alertsOnly || item.stock < item.reorder) && `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(query)).map((item) => `<tr data-inventory-row><td>${item.name}</td><td class="mono">${item.sku}</td><td>${item.category}</td><td>${item.stock} ${item.unit}</td><td>${badge(item.stock < item.reorder ? 'Reordenar' : 'Disponible')}</td><td>${item.value}</td></tr>`).join('')
}

function inventoryPage() {
  return `${pageHeading('OPERACIONES / ABASTECIMIENTO', 'Inventarios y repuestos', 'Existencias, valorización y alertas de reorden', '<button class="secondary" data-action="new-item">＋ Nueva referencia</button>')}
    <section class="metrics three-metrics">${metric('Referencias activas', '1,284', 'Repuestos y suministros', '▦')}${metric('Valorización total', '$2.840M', 'COP · inventario', '$', 'neutral')}${metric('Alertas de reorden', '18', '5 críticas · 13 preventivas', '!', 'purple')}</section>
    <section class="surface">${surfaceTitle('Inventario de materiales', 'Existencias en almacenes principales', '<button class="secondary inventory-filter" data-action="low-stock">⚑ Solo bajo reorden</button>')}
      <div class="table-toolbar"><label class="search-field">⌕ <input type="search" placeholder="Buscar item, SKU o categoría" data-inventory-search></label><span class="table-count" data-inventory-count></span></div>
      <div data-inventory-table>${table(['Item', 'SKU', 'Categoría', 'Stock actual', 'Punto de reorden', 'Valorización'], inventoryRows())}</div>
    </section><aside class="notice-box"><span class="operation-icon">▤</span><span><strong>Control de reposición</strong> · Los puntos de reorden notifican a Compras cuando el stock llega al mínimo configurado.</span><button class="text-button" data-action="toast" data-message="Alertas de inventario listas para configurar">Configurar alertas →</button></aside>`
}

function securityPage() {
  const permissions = ['Trituración', 'Flota', 'Finanzas', 'RRHH', 'Compras']
  return `${pageHeading('SISTEMA / ADMINISTRACIÓN', 'Perfil y seguridad', 'Preferencias de cuenta, permisos y auditoría', '<button class="primary" data-action="save-settings">✓ Guardar cambios</button>')}
    <div class="security-grid"><section class="surface">${surfaceTitle('Información personal', 'Super administrador')}<div class="profile-info"><div class="profile-avatar">SA</div><div class="profile-fields"><label>Nombre completo<input value="Super Admin" readonly></label><label>Correo electrónico<input value="superadmin@zafiro.com.co" readonly></label><label>Teléfono<input value="+57 602 733 4500" readonly></label><label>Unidad de negocio<select class="select-control"><option>Operaciones globales</option><option>Infraestructura</option><option>Materiales</option></select></label></div></div></section>
    <section class="surface">${surfaceTitle('Configuración de cuenta', 'Acceso y notificaciones')}<div class="setting-row"><span class="setting-copy"><strong>Autenticación de dos factores</strong><small>Seguridad adicional para la cuenta</small></span><button class="toggle" role="switch" aria-checked="false" data-toggle><span></span></button></div><div class="setting-row"><span class="setting-copy"><strong>Preferencias de notificación</strong><small>Alertas de actividad y operación</small></span><button class="toggle" role="switch" aria-checked="true" data-toggle><span></span></button></div><button class="secondary" data-action="change-password">◇ Cambiar contraseña</button></section></div>
    <div class="page-grid-two"><section class="surface">${surfaceTitle('Matriz de permisos', 'Permisos del rol · Super administrador')}${table(['Unidad de negocio', 'Acceso', 'Permisos', 'Reportes', 'Acciones'], permissions.map((permission) => `<tr><td>${permission}</td>${[0,1,2,3].map((index) => `<td><input class="check-control" type="checkbox" aria-label="${['Acceso','Permisos','Reportes','Acciones'][index]} para ${permission}" ${permission === 'RRHH' && index === 3 ? '' : 'checked'}></td>`).join('')}</tr>`).join(''))}</section>
    <section class="surface">${surfaceTitle('Bitácora de auditoría', 'Actividad reciente')}<div class="audit-item"><span class="audit-icon">♙</span><span class="audit-copy"><strong>Usuario Admin · Cambio de rol</strong><small>Super Admin · Finanzas</small></span><time>10:45 AM</time></div><div class="audit-item"><span class="audit-icon">⚙</span><span class="audit-copy"><strong>Configuración del sistema</strong><small>Respaldo de base de datos</small></span><time>09:30 AM</time></div><div class="audit-item"><span class="audit-icon">$</span><span class="audit-copy"><strong>Reporte financiero aprobado</strong><small>Q3 · Operaciones globales</small></span><time>Ayer</time></div></section></div>`
}

function navigationHTML() {
  const groups = [...new Set(pages.map((page) => page.group))]
  return groups.map((group) => `<div class="nav-group"><span class="nav-label">${group}</span>${pages.filter((page) => page.group === group).map((page) => `<a class="nav-link ${page.key === pageKey ? 'active' : ''}" href="${ROOT}${page.file}" ${page.key === pageKey ? 'aria-current="page"' : ''}><span class="nav-icon" aria-hidden="true">${page.icon}</span><span>${page.label}</span>${page.key === pageKey ? '<span class="nav-chevron">›</span>' : ''}</a>`).join('')}</div>`).join('')
}

function getPageContent() {
  if (pageKey === 'finance') return financePage()
  if (pageKey === 'plant') return plantPage()
  if (pageKey === 'fleet') return fleetPage()
  if (pageKey === 'inventory') return inventoryPage()
  if (pageKey === 'security') return securityPage()
  return overviewPage()
}

function renderShell() {
  document.title = `${pages.find((page) => page.key === pageKey)?.label || 'Panel ejecutivo'} | ORVIA`
  document.getElementById('orvia-app').innerHTML = `<div class="app-shell">
    <aside class="sidebar" id="sidebar"><a class="brand" href="${ROOT}orvia.html"><img src="${ROOT}orvia-mark.svg" alt=""><span class="brand-copy"><strong>CONSTRUOBRAS</strong><span>ZAFIRO S.A.S.</span></span></a>
      <label class="sidebar-search">⌕ <input type="search" placeholder="Buscar módulo" aria-label="Buscar módulo" data-sidebar-search></label>
      <nav class="side-nav" aria-label="Módulos del sistema">${navigationHTML()}</nav>
      <div class="sidebar-bottom"><span class="system-health"><i class="health-dot"></i> Todos los sistemas operativos</span><span>ORVIA · versión 2.0</span></div>
    </aside>
    <button class="mobile-scrim" data-action="close-menu" aria-label="Cerrar menú" hidden></button>
    <main class="workspace"><header class="topbar"><div class="topbar-left"><button class="mobile-menu" data-action="toggle-menu" aria-label="Abrir menú">☰</button><label class="global-search">⌕ <input type="search" placeholder="Buscar en ORVIA..." aria-label="Buscar en ORVIA" data-global-search><span class="search-results" data-search-results hidden></span></label></div>
      <div class="topbar-actions"><button class="toolbar-button ai" data-action="open-ai"><span aria-hidden="true">✧</span><span class="ai-label">Asistente IA</span></button>
        <div class="menu-wrap"><button class="toolbar-button operation" data-action="toggle-operations"><span aria-hidden="true">◎</span><span class="operation-label" data-operation-label>Operaciones globales</span><span>⌄</span></button><div class="popover" data-popover="operations" hidden><h3>Contexto operativo</h3><button data-operation="Operaciones globales">◉ Operaciones globales</button><button data-operation="Infraestructura">▤ Infraestructura</button><button data-operation="Materiales">▦ Materiales</button><button data-operation="Energía">ϟ Energía</button></div></div>
        <div class="menu-wrap"><button class="icon-button" data-action="toggle-notifications" aria-label="Notificaciones">♧<i class="notification-mark"></i></button><div class="popover popover-notification" data-popover="notifications" hidden><h3>Notificaciones · 3 nuevas</h3><p><b>Stock bajo</b><small>Aceite hidráulico SAE 68 · hace 8 min</small></p><p><b>Mantenimiento próximo</b><small>EX-103 · en 12 horas</small></p><p><b>Reporte listo</b><small>Cierre financiero Q3 · hace 1 h</small></p><button data-action="read-notifications">Marcar como leídas</button></div></div>
        <div class="menu-wrap"><button class="user-button" data-action="toggle-user"><span class="avatar">SA</span><span class="user-name"><strong>Super Admin</strong><small>Administrador</small></span><span class="user-chevron">⌄</span></button><div class="popover" data-popover="user" hidden><a href="./seguridad.html">♙ Mi perfil</a><a href="./seguridad.html">⚙ Preferencias</a><a href="./orvia.html">↩ Volver a ORVIA</a></div></div>
      </div></header><div class="main-content">${getPageContent()}<footer class="page-footer"><span>© 2026 Construobras Zafiro S.A.S.</span><span><i></i> Datos demostrativos · ORVIA v2.0</span></footer></div></main>
    <div class="modal-backdrop" data-modal hidden><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><strong id="modal-title">Asistente ORVIA</strong><button class="icon-button" data-action="close-modal" aria-label="Cerrar">×</button></header><div class="modal-body"><div class="chat-log" data-chat-log><p class="chat-message">Hola, soy ORVIA IA. Puedo ayudarte a consultar indicadores y operaciones de demostración.</p></div><div class="quick-prompts"><button class="secondary" data-prompt="¿Cuál es la producción de hoy?">Producción de hoy</button><button class="secondary" data-prompt="¿Qué repuestos necesitan reorden?">Alertas de inventario</button></div><form class="chat-form" data-chat-form><input data-chat-input placeholder="Pregunta por finanzas, flota o planta..." aria-label="Consulta para el asistente"><button class="primary" aria-label="Enviar consulta">Enviar ↗</button></form></div></section></div>
    <div class="toast" data-toast role="status" hidden></div>
  </div>`
}

function showToast(message) {
  const toast = document.querySelector('[data-toast]')
  toast.textContent = message
  toast.hidden = false
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => { toast.hidden = true }, 2600)
}

function updateTableCount() {
  const visible = [...document.querySelectorAll('[data-transaction]')].filter((row) => !row.hidden).length
  const count = document.querySelector('[data-table-count]')
  if (count) count.textContent = `${visible} transacciones`
}

function filterTransactions(status) {
  document.querySelectorAll('[data-status-filter]').forEach((button) => button.classList.toggle('active', button.dataset.statusFilter === status))
  document.querySelectorAll('[data-transaction]').forEach((row) => { row.hidden = (status !== 'Todos' && row.dataset.status !== status) })
  const body = document.querySelector('[data-transaction-table] tbody')
  if (body && ![...body.querySelectorAll('[data-transaction]')].some((row) => !row.hidden)) body.innerHTML = '<tr class="filter-empty"><td colspan="5" class="table-empty">No hay transacciones con este estado.</td></tr>'
  updateTableCount()
}

function exportTransactions() {
  const header = ['Fecha', 'Descripción', 'Monto', 'Estado']
  const rows = transactions.map((item) => [item.date, item.description, item.amount, item.status])
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'orvia-transacciones.csv'
  anchor.click()
  URL.revokeObjectURL(url)
  showToast('Reporte CSV descargado')
}

function updateInventory() {
  const query = (document.querySelector('[data-inventory-search]')?.value || '').trim().toLowerCase()
  const lowOnly = document.querySelector('[data-action="low-stock"]')?.classList.contains('active') || false
  const rows = inventory.filter((item) => (!lowOnly || item.stock < item.reorder) && `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(query))
  const target = document.querySelector('[data-inventory-table] tbody')
  if (target) target.innerHTML = rows.length ? rows.map((item) => `<tr data-inventory-row><td>${item.name}</td><td class="mono">${item.sku}</td><td>${item.category}</td><td>${item.stock} ${item.unit}</td><td>${badge(item.stock < item.reorder ? 'Reordenar' : 'Disponible')}</td><td>${item.value}</td></tr>`).join('') : '<tr><td class="table-empty" colspan="6">No se encontraron referencias.</td></tr>'
  const count = document.querySelector('[data-inventory-count]')
  if (count) count.textContent = `${rows.length} referencias`
}

function applySearch(value) {
  const results = document.querySelector('[data-search-results]')
  const query = value.trim().toLowerCase()
  if (!results) return
  if (!query) { results.hidden = true; return }
  const matches = pages.filter((page) => page.label.toLowerCase().includes(query))
  results.innerHTML = matches.length ? matches.map((page) => `<a href="${page.file}">${page.icon} ${page.label} <span>→</span></a>`).join('') : '<span class="search-empty">No se encontraron módulos</span>'
  results.hidden = false
}

function togglePopover(name) {
  document.querySelectorAll('[data-popover]').forEach((popover) => { popover.hidden = popover.dataset.popover !== name || !popover.hidden })
}

function sendChat(message) {
  const log = document.querySelector('[data-chat-log]')
  if (!log || !message.trim()) return
  const user = document.createElement('p')
  user.className = 'chat-message user'
  user.textContent = message.trim()
  log.append(user)
  const response = document.createElement('p')
  response.className = 'chat-message'
  response.textContent = 'En esta demostración, la producción de hoy suma 12,500 toneladas y la Planta A opera al 89.8%. Puedes abrir el módulo relacionado desde el menú lateral.'
  log.append(response)
  log.scrollTop = log.scrollHeight
  const input = document.querySelector('[data-chat-input]')
  if (input) input.value = ''
}

function initInteractions() {
  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]')
    if (actionButton) {
      const action = actionButton.dataset.action
      if (action === 'toggle-menu') {
        document.querySelector('.sidebar').classList.toggle('open')
        document.querySelector('.mobile-scrim').hidden = !document.querySelector('.sidebar').classList.contains('open')
      }
      if (action === 'close-menu') {
        document.querySelector('.sidebar').classList.remove('open')
        document.querySelector('.mobile-scrim').hidden = true
      }
      if (action === 'open-ai') document.querySelector('[data-modal]').hidden = false
      if (action === 'close-modal') document.querySelector('[data-modal]').hidden = true
      if (action === 'toggle-operations') togglePopover('operations')
      if (action === 'toggle-notifications') togglePopover('notifications')
      if (action === 'toggle-user') togglePopover('user')
      if (action === 'read-notifications') { document.querySelector('.notification-mark').hidden = true; actionButton.textContent = 'Notificaciones leídas' }
      if (action === 'export-csv') exportTransactions()
      if (action === 'low-stock') { actionButton.classList.toggle('active'); updateInventory() }
      if (action === 'resolve-alert') { actionButton.textContent = 'Atendida'; actionButton.disabled = true; actionButton.closest('.alert-row').classList.add('resolved') }
      if (action === 'clear-vehicle') { document.querySelectorAll('[data-vehicle-card]').forEach((card) => card.classList.remove('selected')); document.querySelector('[data-vehicle-note]').hidden = true }
      if (action === 'save-settings') showToast('Preferencias guardadas correctamente')
      if (action === 'change-password') showToast('Solicitud de cambio de contraseña enviada')
      if (action === 'new-item') showToast('Formulario de nueva referencia listo para configurar')
      if (action === 'new-transaction') showToast('Nueva transacción: formulario de demostración')
      if (action === 'toast') showToast(actionButton.dataset.message || 'Acción completada')
    }

    const operation = event.target.closest('[data-operation]')
    if (operation) { document.querySelector('[data-operation-label]').textContent = operation.dataset.operation; document.querySelectorAll('[data-popover]').forEach((popover) => { popover.hidden = true }) }

    const statusFilter = event.target.closest('[data-status-filter]')
    if (statusFilter) filterTransactions(statusFilter.dataset.statusFilter)

    const lineButton = event.target.closest('[data-line-toggle]')
    if (lineButton) {
      const running = lineButton.classList.toggle('running')
      lineButton.classList.toggle('stopped', !running)
      lineButton.setAttribute('aria-pressed', String(running))
      lineButton.querySelector('.line-state').textContent = running ? 'ACTIVA' : 'DETENIDA'
      lineButton.querySelector('.line-copy small').textContent = running ? 'Activa · 96% disponibilidad' : 'En espera · sin producción'
      showToast(`${lineButton.querySelector('.line-copy strong').textContent}: ${running ? 'línea activada' : 'línea detenida'}`)
    }

    const vehicle = event.target.closest('[data-vehicle-card]')
    if (vehicle) {
      document.querySelectorAll('[data-vehicle-card]').forEach((card) => card.classList.toggle('selected', card === vehicle))
      document.querySelector('[data-selected-vehicle]').textContent = `${vehicle.dataset.vehicle} · ${vehicle.querySelector('strong').textContent}`
      document.querySelector('[data-vehicle-note]').hidden = false
    }

    const toggle = event.target.closest('[data-toggle]')
    if (toggle) { const enabled = toggle.getAttribute('aria-checked') !== 'true'; toggle.setAttribute('aria-checked', String(enabled)); showToast(enabled ? 'Preferencia activada' : 'Preferencia desactivada') }

    const prompt = event.target.closest('[data-prompt]')
    if (prompt) sendChat(prompt.dataset.prompt)

    if (event.target.matches('[data-modal]')) event.target.hidden = true
    if (!event.target.closest('.menu-wrap')) document.querySelectorAll('[data-popover]').forEach((popover) => { popover.hidden = true })
  })

  document.querySelector('[data-global-search]')?.addEventListener('input', (event) => applySearch(event.target.value))
  document.querySelector('[data-global-search]')?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.target.value = ''; applySearch('') }
    if (event.key === 'Enter') document.querySelector('[data-search-results] a')?.click()
  })
  document.querySelector('[data-sidebar-search]')?.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase()
    document.querySelectorAll('.nav-link').forEach((link) => { link.hidden = !link.textContent.toLowerCase().includes(query) })
  })
  document.querySelector('[data-fleet-filter]')?.addEventListener('change', (event) => {
    document.querySelectorAll('[data-vehicle-card]').forEach((card) => { card.hidden = event.target.value !== 'Todos' && card.dataset.status !== event.target.value })
  })
  document.querySelector('[data-inventory-search]')?.addEventListener('input', updateInventory)
  document.querySelector('[data-chat-form]')?.addEventListener('submit', (event) => { event.preventDefault(); sendChat(document.querySelector('[data-chat-input]').value) })
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { document.querySelector('[data-modal]').hidden = true; document.querySelectorAll('[data-popover]').forEach((popover) => { popover.hidden = true }); document.querySelector('.sidebar').classList.remove('open'); document.querySelector('.mobile-scrim').hidden = true } })
  if (pageKey === 'finance') updateTableCount()
  if (pageKey === 'inventory') updateInventory()
}

renderShell()
initInteractions()