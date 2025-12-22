# SoftCount - Imágenes del Proyecto

Coloca aquí las capturas de pantalla del proyecto SoftCount.

## Sistema dinámico:
Puedes agregar tantas imágenes como quieras. El sistema detectará automáticamente todas las imágenes que agregues al array `images` en `projects.json`.

## Cómo agregar imágenes:
1. Guarda tus capturas en esta carpeta con nombres descriptivos (ej: `screenshot-1.png`, `screenshot-2.png`, etc.)
2. Actualiza el array `images` en `src/config/projects.json` para el proyecto `softcount`
3. La primera imagen del array se mostrará en la página principal
4. Todas las imágenes se mostrarán en la vista detallada del portfolio

## Ejemplo en projects.json:
```json
"images": [
  "/projects/softcount/screenshot-1.png",
  "/projects/softcount/screenshot-2.png",
  "/projects/softcount/screenshot-3.png"
]
```

## Recomendaciones:
- Formato: PNG o JPG (asegúrate de que la ruta en el JSON coincida con la extensión)
- Tamaño recomendado: 1920x1080 o similar (16:9)
- Peso máximo: 500KB por imagen (optimizar para web)
- Contenido: Capturas del dashboard, funcionalidades principales, vistas importantes

## Estado actual:
✅ `screenshot-1.png` - Agregado y configurado en projects.json
