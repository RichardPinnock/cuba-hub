import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Enseña a tailwind-merge las clases propias de tokens.js para que `text-body` reemplace a `text-base`, etc.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'title', 'heading', 'body', 'label', 'caption', 'amount'] }],
      rounded: [{ rounded: ['card'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
