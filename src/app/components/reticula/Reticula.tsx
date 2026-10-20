/** Plano de 4 columnas: marco en --guide y líneas interiores en --guide-soft, a todo lo alto del padre (`relative`). */
export default function Reticula() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <div className="container-main h-full">
        <div className="grid h-full grid-cols-1 border-x border-guide md:grid-cols-4">
          <div className="hidden border-r border-guide-soft md:block" />
          <div className="hidden border-r border-guide-soft md:block" />
          <div className="hidden border-r border-guide-soft md:block" />
          <div className="hidden md:block" />
        </div>
      </div>
    </div>
  );
}
