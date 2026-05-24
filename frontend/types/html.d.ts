declare namespace astroHTML {
    namespace JSX {
        // `InputHTMLAttributes` es una interfaz; la redeclaración la mezcla y permite ampliar `type`.
        interface InputHTMLAttributes<T> {
            type?: string | null | undefined;
        }
    }
}
