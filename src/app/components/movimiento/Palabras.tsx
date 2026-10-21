import { Fragment, type CSSProperties } from 'react';
import { partirPalabras } from '@/lib/movimiento';

type Props = {
  texto: string;
  lang: string;
  /** Momento (ms) de la carga inicial en que sube la primera palabra; sin él, suben al entrar en pantalla. */
  entrada?: number;
  /** Escalonado entre palabras (ms). */
  paso?: number;
};

/** Texto que sube palabra a palabra dentro de su máscara. Es texto real: se lee y se indexa igual. */
export default function Palabras({ texto, lang, entrada, paso = 45 }: Props) {
  const inicio = entrada ?? 0;
  return partirPalabras(texto, lang).map((palabra, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span className="mov-palabra">
        <span
          data-mov="subir"
          {...(entrada !== undefined && { 'data-mov-entrada': '' })}
          style={{ '--retraso': `${inicio + i * paso}ms` } as CSSProperties}
        >
          {palabra}
        </span>
      </span>
    </Fragment>
  ));
}
