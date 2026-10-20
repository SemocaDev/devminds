import { cn } from '@/lib/utils';

/** Marca "DevMinds" en Doto 900. Único lugar donde se define el wordmark. */
export default function Wordmark({ className }: { className?: string }) {
  return <span className={cn('font-doto font-black tracking-[-0.03em]', className)}>DevMinds</span>;
}
