// React (el que trae Next 16.1) exporta <ViewTransition>, pero @types/react 19.0 aún no lo declara.
import 'react';

declare module 'react' {
  export const ViewTransition: React.FC<{ name?: string; children?: React.ReactNode }>;
}
