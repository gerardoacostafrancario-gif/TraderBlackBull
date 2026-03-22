<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TraderBlackBull — Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #070809; color: #e2e8f0; font-family: 'DM Sans', sans-serif; min-height: 100vh; }

header {
  background: #0d0f11; border-bottom: 2px solid #c9a84c;
  padding: 16px 28px; display: flex; align-items: center; gap: 14px;
}
header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 2px; color: #c9a84c; }
header span { font-size: 11px; color: #64748b; letter-spacing: 2px; text-transform: uppercase; }
.badge { background: rgba(239,68,68,.15); border: 1px solid rgba(239,68,68,.3); color: #ef4444; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-left: auto; }

.content { padding: 28px; max-width: 1000px; margin: 0 auto; }

.section-title {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 2px; color: #64748b; margin-bottom: 16px;
  border-left: 3px solid #c9a84c; padding-left: 10px;
}

.stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 28px; }
.stat { background: #0d0f11; border: 1px solid #1e2530; border-radius: 10px; padding: 16px 20px; }
.stat-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
.stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f0f6fc; }
.stat-value.gold { color: #c9a84c; }
.stat-value.green { color: #22c55e; }
.stat-value.red { color: #ef4444; }

.table-wrap { background: #0d0f11; border: 1px solid #1e2530; border-radius: 12px; overflow: hidden; margin-bottom: 28px; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: #141820; }
thead th { padding: 12px 16px; text-align: left; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; border-bottom: 1px solid #1e2530; }
tbody tr { border-bottom: 1px solid #1e2530; transition: background .15s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: rgba(255,255,255,.02); }
td { padding: 14px 16px; font-size: 13px; vertical-align: middle; }

.tag { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.tag.pendiente { background: rgba(201,168,76,.15); color: #c9a84c; border: 1px solid rgba(201,168,76,.3); }
.tag.aprobado  { background: rgba(34,197,94,.15);  color: #22c55e;  border: 1px solid rgba(34,197,94,.3); }
.tag.rechazado { background: rgba(239,68,68,.15);  color: #ef4444;  border: 1px solid rgba(239,68,68,.3); }

.btn { padding: 7px 16px; border-radius: 7px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
.btn-approve { background: rgba(34,197,94,.15); color: #22c55e; border: 1px solid rgba(34,197,94,.3); }
.btn-approve:hover { background: #22c55e; color: #000; }
.btn-reject  { background: rgba(239,68,68,.15); color: #ef4444; border: 1px solid rgba(239,68,68,.3); }
.btn-reject:hover  { background: #ef4444; color: #fff; }
.btn-pending { background: rgba(201,168,76,.15); color: #c9a84c; border: 1px solid rgba(201,168,76,.3); }
.btn-pending:hover { background: #c9a84c; color: #000; }

.actions { display: flex; gap: 8px; }

.empty { text-align: center; padding: 40px; color: #475569; font-size: 13px; }

.toast { position: fixed; bottom: 20px; right: 20px; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 13px; opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 99; }
.toast.show { opacity: 1; }
.toast.success { background: #0f2818; border: 1px solid rgba(34,197,94,.3); color: #22c55e; }
.toast.warn    { background: #1c1205; border: 1px solid rgba(201,168,76,.3); color: #c9a84c; }

.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.login-card { background: #0d0f11; border: 1px solid #1e2530; border-radius: 14px; padding: 40px; width: 100%; max-width: 380px; text-align: center; }
.login-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 2px; color: #c9a84c; margin-bottom: 6px; }
.login-sub { font-size: 12px; color: #64748b; margin-bottom: 24px; }
.form-group { margin-bottom: 14px; text-align: left; }
.form-label { display: block; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 5px; }
.form-input { width: 100%; background: #070809; border: 1px solid #1e2530; color: #f0f6fc; padding: 10px 12px; border-radius: 7px; font-size: 13px; font-family: 'DM Sans', sans-serif; }
.form-input:focus { outline: none; border-color: #c9a84c; }
.btn-login { width: 100%; padding: 11px; background: #c9a84c; color: #000; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-top: 6px; }
.btn-login:hover { background: #e8c46a; }
.auth-msg { margin-top: 12px; padding: 10px; border-radius: 7px; font-size: 12px; display: none; }
.auth-msg.error { background: #1c0505; border: 1px solid rgba(239,68,68,.3); color: #ef4444; display: block; }

#admin-panel { display: none; }
#login-panel { display: block; }
</style>
</head>
<body>

<!-- LOGIN ADMIN -->
<div id="login-panel" class="login-wrap">
  <div class="login-card">
    <div class="login-title">🐂 PANEL ADMIN</div>
    <div class="login-sub">TraderBlackBull · Solo administradores</div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" id="admin-email" class="form-input" placeholder="tu@email.com">
    </div>
    <div class="form-group">
      <label class="form-label">Contraseña</label>
      <input type="password" id="admin-pass" class="form-input" placeholder="••••••••" onkeydown="if(event.key==='Enter')adminLogin()">
    </div>
    <button class="btn-login" onclick="adminLogin()">Ingresar al panel</button>
    <div class="auth-msg" id="admin-msg"></div>
  </div>
</div>

<!-- PANEL ADMIN -->
<div id="admin-panel">
  <header>
    <div>
      <h1>🐂 PANEL DE ADMINISTRACIÓN</h1>
      <span>TraderBlackBull · Gestión de usuarios</span>
    </div>
    <div style="margin-left:auto;display:flex;align-items:center;gap:12px">
      <span id="admin-user" style="font-size:12px;color:#64748b"></span>
      <button onclick="adminLogout()" style="background:transparent;border:1px solid #1e2530;color:#64748b;padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;">Salir</button>
    </div>
  </header>

  <div class="content">
    <div class="stats" id="stats-wrap">
      <div class="stat"><div class="stat-label">Total usuarios</div><div class="stat-value gold" id="stat-total">0</div></div>
      <div class="stat"><div class="stat-label">Pendientes</div><div class="stat-value red" id="stat-pendiente">0</div></div>
      <div class="stat"><div class="stat-label">Aprobados</div><div class="stat-value green" id="stat-aprobado">0</div></div>
    </div>

    <div class="section-title">⏳ Usuarios Pendientes de Aprobación</div>
    <div class="table-wrap" id="tabla-pendientes">
      <div class="empty">Cargando...</div>
    </div>

    <div class="section-title">👥 Todos los Usuarios</div>
    <div class="table-wrap" id="tabla-todos">
      <div class="empty">Cargando...</div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const SB_URL = 'https://ocvnrfdeeayynedwrspb.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdm5yZmRlZWF5eW5lZHdyc3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTc0NDIsImV4cCI6MjA4OTc3MzQ0Mn0.CBg2JMkREVV3xV0wmCN25o6CSOK9Jmp4o6MLZl_CdDs';
const SB_SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdm5yZmRlZWF5eW5lZHdyc3BiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE5NzQ0MiwiZXhwIjoyMDg5NzczNDQyfQ.y1MHfvzGoVEW8RltmwbPJSwPoLjXc9qhu2D4b7NGBvA';

const { createClient } = supabase;
const sb = createClient(SB_URL, SB_ANON);
const sbAdmin = createClient(SB_URL, SB_SERVICE);

let currentToken = null;

async function adminLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const pass  = document.getElementById('admin-pass').value;
  if (!email || !pass) return;

  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) {
    document.getElementById('admin-msg').textContent = 'Email o contraseña incorrectos';
    document.getElementById('admin-msg').className = 'auth-msg error';
    return;
  }

  // Verificar que es usuario aprobado
  const { data: profile } = await sbAdmin.from('profiles').select('estado').eq('id', data.user.id).single();
  if (!profile || profile.estado !== 'aprobado') {
    document.getElementById('admin-msg').textContent = 'No tenés acceso al panel admin';
    document.getElementById('admin-msg').className = 'auth-msg error';
    await sb.auth.signOut();
    return;
  }

  currentToken = data.session.access_token;
  document.getElementById('admin-user').textContent = email;
  document.getElementById('login-panel').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  cargarUsuarios();
}

async function adminLogout() {
  await sb.auth.signOut();
  location.reload();
}

async function cargarUsuarios() {
  const { data, error } = await sbAdmin.from('profiles').select('*').order('created_at', { ascending: false });
  
  if (error || !data) {
    document.getElementById('tabla-pendientes').innerHTML = '<div class="empty">Error al cargar usuarios</div>';
    return;
  }

  // Stats
  document.getElementById('stat-total').textContent = data.length;
  document.getElementById('stat-pendiente').textContent = data.filter(u => u.estado === 'pendiente').length;
  document.getElementById('stat-aprobado').textContent = data.filter(u => u.estado === 'aprobado').length;

  // Tabla pendientes
  const pendientes = data.filter(u => u.estado === 'pendiente');
  if (pendientes.length === 0) {
    document.getElementById('tabla-pendientes').innerHTML = '<div class="empty">✅ No hay usuarios pendientes</div>';
  } else {
    document.getElementById('tabla-pendientes').innerHTML = renderTabla(pendientes, true);
  }

  // Tabla todos
  document.getElementById('tabla-todos').innerHTML = renderTabla(data, false);
}

function renderTabla(usuarios, soloAcciones) {
  return `<table>
    <thead><tr>
      <th>Nombre</th><th>Email</th><th>Estado</th><th>Fecha registro</th><th>Acciones</th>
    </tr></thead>
    <tbody>
      ${usuarios.map(u => `<tr>
        <td style="font-weight:600;color:#f0f6fc">${u.nombre || '–'}</td>
        <td style="color:#94a3b8;font-size:12px">${u.email}</td>
        <td><span class="tag ${u.estado}">${u.estado}</span></td>
        <td style="color:#64748b;font-size:12px">${new Date(u.created_at).toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}</td>
        <td>
          <div class="actions">
            ${u.estado !== 'aprobado'  ? `<button class="btn btn-approve" onclick="cambiarEstado('${u.id}','${u.email}','aprobado')">✅ Aprobar</button>` : ''}
            ${u.estado !== 'pendiente' ? `<button class="btn btn-pending" onclick="cambiarEstado('${u.id}','${u.email}','pendiente')">⏳ Pendiente</button>` : ''}
            ${u.estado !== 'rechazado' ? `<button class="btn btn-reject"  onclick="cambiarEstado('${u.id}','${u.email}','rechazado')">❌ Rechazar</button>` : ''}
          </div>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

async function cambiarEstado(id, email, nuevoEstado) {
  const { error } = await sbAdmin.from('profiles').update({ estado: nuevoEstado }).eq('id', id);
  if (error) {
    toast('Error al actualizar', 'warn');
    return;
  }
  const msgs = { aprobado: `✅ ${email} aprobado`, pendiente: `⏳ ${email} puesto en pendiente`, rechazado: `❌ ${email} rechazado` };
  toast(msgs[nuevoEstado], 'success');
  cargarUsuarios();
}

function toast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast show ${type}`;
  clearTimeout(window._tt);
  window._tt = setTimeout(() => t.classList.remove('show'), 3000);
}
</script>
</body>
</html>
