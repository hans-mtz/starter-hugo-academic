/**
 * Ventana — puente de Google Apps Script para el tracker de ayuno.
 *
 * Qué hace:
 *   - Recibe tus datos desde la app (POST) y los guarda en la hoja.
 *   - Los devuelve a la app cuando pulsas "Traer de Sheets" (GET / JSONP).
 *   - Crea/usa una pestaña "datos" que es la FUENTE DE VERDAD:
 *       columnas: id | tipo | fecha_hora | valor1 | valor2 | valor3 | valor4 | nota
 *       valor3/valor4 solo se usan en filas "medicion" (cuello y cadera,
 *       para el % de grasa corporal); van vacíos en el resto de tipos.
 *       Puedes editar esta tabla A MANO. Si agregas una fila y dejas el id vacío,
 *       el sistema le asigna uno solo. La app lee y escribe desde aquí.
 *       Las columnas se detectan por nombre de encabezado (no por posición),
 *       así que una hoja vieja de 6 columnas (sin valor3/valor4) se sigue
 *       leyendo bien — esas dos quedan null hasta el próximo guardado, que
 *       reescribe todo con el esquema nuevo.
 *   - La vieja pestaña "_json" ya no se usa; puedes borrarla si quieres.
 *
 * Cómo instalarlo (una sola vez):
 *   1. Abre https://sheets.google.com y crea una hoja nueva (o usa una existente).
 *   2. En esa hoja: menú Extensiones > Apps Script.
 *   3. Borra todo lo que haya y pega ESTE archivo completo.
 *   4. Guarda (icono de disquete).
 *   5. Pulsa "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 *   6. Tipo: "Aplicación web" (Web app).
 *   7. "Ejecutar como": Yo (tu cuenta).
 *   8. "Quién tiene acceso": Cualquier usuario (Anyone).
 *   9. Implementar, autoriza los permisos que pida.
 *  10. Copia la "URL de la aplicación web" (termina en /exec).
 *  11. Pega esa URL en la app, sección "Sincronización con Google Sheets".
 */

var DATA_SHEET = "datos";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var incoming = JSON.parse(e.postData.contents);
    // Fusiona con lo que ya hay en la hoja (unión por id) en vez de sobreescribir.
    // Así, si empujas datos incompletos (o vacíos) desde un dispositivo, NO borras
    // lo que solo existe en la hoja o en otro dispositivo.
    var merged = mergeData(readAll(), incoming);
    writeAll(merged);
    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ---- fusión por id (unión de registros de ambas fuentes) ----
function mergeById(a, b) {
  var map = {};
  (a || []).forEach(function (x) { if (x && x.id) map[x.id] = x; });
  (b || []).forEach(function (x) { if (x && x.id) map[x.id] = x; }); // b (lo nuevo) gana empates
  return Object.keys(map).map(function (k) { return map[k]; });
}
function mergeByDate(a, b) {
  var map = {};
  (a || []).forEach(function (x) { if (x && x.date) map[x.date] = x; });
  (b || []).forEach(function (x) {
    if (!x || !x.date) return;
    var existing = map[x.date];
    if (!existing) { map[x.date] = x; return; }
    // Fusión por campo, no por objeto completo: si un lado no trae
    // cuello/cadera todavía (p.ej. una fila vieja de la hoja), no debe
    // borrar lo que el otro lado sí tiene para esa misma fecha.
    map[x.date] = {
      id: x.id || existing.id,
      date: x.date,
      weight: x.weight != null ? x.weight : (existing.weight != null ? existing.weight : null),
      waist: x.waist != null ? x.waist : (existing.waist != null ? existing.waist : null),
      neck: x.neck != null ? x.neck : (existing.neck != null ? existing.neck : null),
      hip: x.hip != null ? x.hip : (existing.hip != null ? existing.hip : null)
    };
  });
  return Object.keys(map).map(function (k) { return map[k]; });
}
function mergeData(base, incoming) {
  base = base || {}; incoming = incoming || {};
  return {
    meals: mergeById(base.meals, incoming.meals),
    measurements: mergeByDate(base.measurements, incoming.measurements),
    ketones: mergeById(base.ketones, incoming.ketones),
    phases: mergeById(base.phases, incoming.phases)
  };
}

function doGet(e) {
  var data = readAll();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Antigua doGet: se bloqueaba la extraccion de datos por bloqueadores Safari y
 * en modo "abrir como aplicacion web"
function doGet(e) {
  var data = readAll();
  var body = JSON.stringify(data);
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    // JSONP: la app lee esto con una etiqueta <script>, evita problemas de CORS.
    return ContentService.createTextOutput(cb + "(" + body + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}
*/

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ssActive() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreate(name) {
  var ss = ssActive();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function writeAll(payload) {
  var dsh = getOrCreate(DATA_SHEET);
  dsh.clear();
  var rows = [["id", "tipo", "fecha_hora", "valor1", "valor2", "valor3", "valor4", "nota"]];
  (payload.meals || []).forEach(function (m) {
    rows.push([m.id || "", "comida", m.ts, "", "", "", "", m.note || ""]);
  });
  (payload.measurements || []).forEach(function (m) {
    rows.push([
      m.id || "", "medicion", m.date,
      m.weight == null ? "" : m.weight,
      m.waist == null ? "" : m.waist,
      m.neck == null ? "" : m.neck,
      m.hip == null ? "" : m.hip,
      ""
    ]);
  });
  (payload.ketones || []).forEach(function (k) {
    rows.push([k.id || "", "cetonas", k.ts, k.value, "", "", "", ""]);
  });
  (payload.phases || []).forEach(function (p) {
    rows.push([p.id || "", "fase", p.startDate, p.protocol, "", "", "", p.note || ""]);
  });
  // Fuerza la columna fecha_hora a TEXTO para que Sheets no convierta los ISO en fechas locales.
  dsh.getRange(1, 3, rows.length, 1).setNumberFormat("@");
  dsh.getRange(1, 1, rows.length, 8).setValues(rows);
}

// Parsea numero o devuelve null.
function numOrNull(x) {
  if (x === "" || x == null) return null;
  var n = Number(x);
  return isNaN(n) ? null : n;
}
// Normaliza fecha/hora a string. Si Sheets lo guardo como Date, lo pasa a ISO.
function toIsoish(v) {
  if (v instanceof Date) return v.toISOString();
  return String(v == null ? "" : v);
}
// Devuelve solo la parte de fecha YYYY-MM-DD.
function dateOnly(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  var s = String(v == null ? "" : v);
  if (s.length >= 10 && s.indexOf("T") >= 0) return s.slice(0, 10);
  return s;
}

function readAll() {
  var empty = { meals: [], measurements: [], ketones: [], phases: [] };
  var dsh = ssActive().getSheetByName(DATA_SHEET);
  if (!dsh) return empty;
  var values = dsh.getDataRange().getValues();
  if (!values || values.length < 2) return empty;

  // Columnas por nombre de encabezado, no por posición fija — así una hoja
  // vieja de 6 columnas (sin valor3/valor4) y una nueva de 8 se leen igual
  // de bien; lo que falte simplemente da índice -1 y se trata como vacío.
  var header = values[0].map(function (h) { return String(h || "").trim().toLowerCase(); });
  var iId = header.indexOf("id");
  var hasId = iId !== -1;
  var iTipo, iFecha, iV1, iV2, iV3, iV4, iNota;
  if (hasId) {
    iTipo = header.indexOf("tipo"); iFecha = header.indexOf("fecha_hora");
    iV1 = header.indexOf("valor1"); iV2 = header.indexOf("valor2");
    iV3 = header.indexOf("valor3"); iV4 = header.indexOf("valor4");
    iNota = header.indexOf("nota");
  } else {
    // Tabla ancestral de 5 columnas, sin id: tipo | fecha_hora | valor1 | valor2 | nota
    iTipo = 0; iFecha = 1; iV1 = 2; iV2 = 3; iV3 = -1; iV4 = -1; iNota = 4;
  }

  var out = { meals: [], measurements: [], ketones: [], phases: [] };
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    var id = hasId ? r[iId] : "";
    var tipo = String(r[iTipo] || "").trim().toLowerCase();
    if (!tipo) continue; // fila en blanco

    var fecha = r[iFecha], v1 = r[iV1], v2 = r[iV2];
    var v3 = iV3 >= 0 ? r[iV3] : null;
    var v4 = iV4 >= 0 ? r[iV4] : null;
    var nota = r[iNota];

    var fechaStr = toIsoish(fecha);
    var fechaDay = dateOnly(fecha);
    // Filas escritas a mano sin id: genera un id determinista por contenido
    // (mismo contenido -> mismo id, para que no se dupliquen al reconsolidar).
    if (id === "" || id == null) id = tipo + "|" + fechaStr + "|" + v1 + "|" + v2;
    id = String(id);

    if (tipo === "comida") {
      out.meals.push({ id: id, ts: fechaStr, note: nota ? String(nota) : "" });
    } else if (tipo === "medicion") {
      out.measurements.push({
        id: id, date: fechaDay,
        weight: numOrNull(v1), waist: numOrNull(v2),
        neck: numOrNull(v3), hip: numOrNull(v4)
      });
    } else if (tipo === "cetonas") {
      out.ketones.push({ id: id, ts: fechaStr, value: numOrNull(v1) });
    } else if (tipo === "fase") {
      out.phases.push({ id: id, startDate: fechaDay, protocol: String(v1 || ""), note: nota ? String(nota) : "" });
    }
  }
  return out;
}