// Amplía el tipo del atributo `type` para los inputs en Astro JSX
// Esto permite usar valores personalizados como "money" sin error de TS.

declare namespace astroHTML {
  namespace JSX {
    // `InputHTMLAttributes` es una interfaz; la redeclaración la mezcla y permite ampliar `type`.
    interface InputHTMLAttributes<T> {
      type?: string | null | undefined;
    }
  }
}
