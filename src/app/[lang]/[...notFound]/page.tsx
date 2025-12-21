import { notFound } from 'next/navigation';

// Esta ruta catch-all captura todas las rutas no definidas
// y llama a notFound() para mostrar la página 404
export default function CatchAllPage() {
  notFound();
}
