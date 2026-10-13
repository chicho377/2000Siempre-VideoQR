# 2000Siempre · Página QR

Fusión del proyecto original de 2000Siempre con la estructura visual de Caffi: inicio con dos opciones, video original, sección Mini Teletón, redes, carrusel de una imagen por página y ampliación de fotos.

## Abrir

Abre `index.html` directamente en el navegador. También puedes servir esta carpeta con `python -m http.server 8080` y entrar en `http://localhost:8080`. No requiere instalación ni compilación.

## Imágenes del carrusel

Ya está cargado el primer afiche de Mini Teletón. Cada imagen ocupa una diapositiva completa y se muestra sin recortes. Se incluyen tres diapositivas provisionales «Próximamente» para probar la navegación; se pueden reemplazar por las próximas imágenes en gallery.js.

1. Guarda las fotografías en `assets/mini-teleton/`.
2. Edita `gallery.js`:

```js
window.MINI_TELETON_PHOTOS = [
  { src: 'assets/mini-teleton/foto-01.jpg', alt: 'Descripción real de la fotografía' },
  { src: 'assets/mini-teleton/foto-02.jpg', alt: 'Descripción real de la fotografía' }
];
```

El carrusel adapta automáticamente sus páginas. Incluye botones, puntos, flechas de teclado y gestos táctiles. Las fotos se amplían en un diálogo que se cierra con Escape o el botón de cierre. No cambia las imágenes automáticamente, para permitir leer y explorar a tu ritmo. Las animaciones se pueden pausar con el botón al pie de la página.

## Publicar y conservar el QR

Sube `index.html`, `styles.css`, `effects.css`, `script.js`, `gallery.js`, `workshops.css`, `workshops.js`, `workshops-data.js` y `assets/` al alojamiento del proyecto original, manteniendo la misma URL a la que apunta el QR. De esa forma, el QR existente abrirá el nuevo selector. No se ha publicado ni modificado el sitio en línea.

Las rutas internas son `#inicio`, `#comunidad` y `#mini-teleton`. El video conserva su archivo, portada y descripción original; los tres enlaces sociales proceden del sitio original. La cabecera conserva el logo oficial proporcionado posteriormente.

`referencias/` conserva los proyectos extraídos para consulta y no se incluye en el paquete de publicación.

## Logo y efectos visuales

La cabecera usa `assets/logo-blanco.png` en inicio y Comunidad preparada, y `assets/logo-mini-teleton.png` en Mini Teletón. La tarjeta de Mini Teletón también usa su logo y el favicon es `assets/favicon.ico`. Se retiraron los emblemas circulares, los aros y los adornos flotantes.

El fondo se recrea en `effects.css` con un degradado radial azul inspirado en Fondo.png; no se carga esa imagen. Las tarjetas tienen una entrada escalonada, una elevación suave al interactuar y desplazamiento de las flechas. El fondo incluye haces de luz suaves y partículas luminosas animadas. Los botones conservan el destello periódico de la versión anterior. El logo de cabecera se presenta sin bloque de fondo. El botón al pie permite pausar las animaciones.

## Capacitaciones anteriores

La sección Comunidad preparada incluye cinco tarjetas y una galería modal por taller. Los datos están en `workshops-data.js`. Cada lista `photos` admite objetos con `src` y `alt`. Se recomienda guardar las imágenes en `assets/talleres/<id-del-taller>/`.

Mientras una lista esté vacía, se muestran tres espacios provisionales identificados como «Próximamente». Al agregar fotografías, sustituyen automáticamente esos espacios. Las imágenes se muestran completas, sin un segundo modal de zoom. La galería incluye flechas, contador, teclado, gestos táctiles, cierre con Escape y retorno del foco a la tarjeta de origen.

Fotos incorporadas: Escobal (23), El Vivero (12), Turrúcares (10), Delegación Policial Hospital (10) y Municipalidad de Atenas (15). Total: 70 fotografías originales. El modal utiliza flechas y un contador, sin puntos por fotografía. Su altura se adapta a la pantalla para mantener la imagen completa, el cierre y los controles visibles sin scroll interno.
