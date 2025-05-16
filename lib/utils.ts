import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina múltiples nombres de clase usando clsx y tailwind-merge
 * Útil para componentes reutilizables con estilos personalizables
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
