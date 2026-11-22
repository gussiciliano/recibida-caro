# Caro se recibe · 27.11.2026

Web estática para celebrar la recibida de Carolina, Licenciada en Sistemas. Hecha con HTML, CSS y JavaScript, sin dependencias.

## Estructura

```
index.html        página principal
css/styles.css    estilos, layout y animaciones
js/main.js        cuenta regresiva, easter egg, copiado y mural de mensajes
imsg-caro/        fotos de Carolina
images/           recursos decorativos heredados del template original
```

## Secciones

- **Portada**: presentación, fecha, cuenta regresiva y accesos rápidos.
- **Agenda**: defensa, festejo post-defensa y cena.
- **Defensa**: 27/11/2026 11:00 hs, Aula 10, Edificio Arturo Jauretche, predio UNLa.
- **Celebración**: fotos y cositas lindas; sin harina ni huevos.
- **Cena**: Anábolena Bar, Lomas de Zamora, 20:30 a 23:30 hs, con menú y bebidas incluidas.
- **Una manito**: transferencia opcional ($1 a $20.000), según lo que cada quien pueda.
- **Mensajes**: el botón abre un Google Form. El mural lee la planilla de respuestas y muestra nombre, mensaje y miniaturas de fotos de Google Drive, con nueve mensajes por página; se actualiza al volver a la página, cada 30 segundos mientras esté visible o al tocar «Actualizar mensajes».
- **Tablero**: un sprint de recuerdos, defensa y festejo.
- **Easter egg**: 5 patitas escondidas que desbloquean una sorpresa.

## Qué completar

Buscá estos placeholders en `index.html` y reemplazalos en el texto **y** en el atributo `data-copy`:

- `[ALIAS_DE_CARO]`
- `[CBU_DE_CARO]`
- `Carolina [APELLIDO]`

## Personalización rápida

- **Fecha/hora**: cambiá `EVENT_DATE` al inicio de `js/main.js` y actualizá los textos de fecha en `index.html`.
- **Fotos**: reemplazá los archivos referenciados de `imsg-caro/` o cambiá los `src` en `index.html`.
- **Ubicaciones**: los botones “Cómo llegar” usan links de Google Maps; podés reemplazarlos por URLs exactas.
- **Mensajes**: probá el formulario y el mural en una ventana privada. La planilla debe permitir lectura pública para que el mural funcione en GitHub Pages; cualquiera podrá acceder a todas sus columnas, no solo a las que muestra la página. El formulario puede pedir iniciar sesión. Informá también en el formulario que los mensajes y fotos se publicarán y revisá las respuestas anteriores antes de compartir la web. Para que las miniaturas y los enlaces funcionen sin iniciar sesión, cada foto necesita permisos de lectura para cualquier persona con el enlace en Google Drive; el mural no cambia esos permisos. Si no se puede cargar una miniatura, se conserva el enlace a la foto. No compartas permisos de edición.
- El mural usa los encabezados `Tu nombre`, `Tu msj para caro` y `Si queres, una foto con caro`. Si los cambiás en el formulario, actualizalos también en `js/main.js`.

## Publicar

Se puede publicar en cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.). Para GitHub Pages: subí la carpeta, entrá a **Settings → Pages**, elegí la rama `main` y la carpeta `/ (root)`.# recibida-caro
