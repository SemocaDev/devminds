/** Guías verticales en los bordes de la columna de contenido, a todo lo alto del padre (`relative`). */
export default function Reticula() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <div className="container-main h-full">
        <div className="h-full border-x border-guide" />
      </div>
    </div>
  );
}
