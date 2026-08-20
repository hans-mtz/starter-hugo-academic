// Netlify Function — proxy entre tu página y Google Apps Script.
//
// Por qué existe: Safari (con bloqueadores) y el modo "app web" de iOS bloquean
// las peticiones directas a dominios de Google. Con este proxy, tu página solo
// habla con hansmartinez.com; Netlify contacta a Google por detrás. Así deja de
// bloquearse en todos los navegadores y en modo aplicación.
//
// Instalación:
//   1. En Netlify: Site configuration → Environment variables → Add a variable.
//      Key:   APPS_SCRIPT_URL
//      Value: tu URL del Apps Script (la que termina en /exec)
//   2. Guarda este archivo en tu repo como:  netlify/functions/sync.js
//   3. Commit y push. Netlify lo detecta y lo publica solo.
//   4. En la app, cambia la URL de sincronización a:  /sync
//      (o, si no configuras el alias, a:  /.netlify/functions/sync )
//
// La URL ya NO vive en el repo: se lee de la variable de entorno de Netlify.

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

exports.handler = async (event) => {
  try {
    if (!APPS_SCRIPT_URL) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "Falta la variable de entorno APPS_SCRIPT_URL en Netlify" }),
      };
    }

    if (event.httpMethod === "GET") {
      const res = await fetch(APPS_SCRIPT_URL, { method: "GET", redirect: "follow" });
      const body = await res.text();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body,
      };
    }

    if (event.httpMethod === "POST") {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: event.body,
        redirect: "follow",
      });
      const body = await res.text();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body,
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};
