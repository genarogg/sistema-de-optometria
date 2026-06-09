import { useRef, useEffect, useCallback } from 'react';
import { activateMoneyInput, initMoneyInputs, type MoneyInputController, type MoneyConfig } from 'supermoney';
import { Input } from '@/components/ui/input';

// ─── init global (se ejecuta una sola vez en toda la app) ─────────────────────
let globalInitDone = false;

const ensureGlobalInit = (config?: MoneyConfig) => {
    if (globalInitDone) return;
    globalInitDone = true;
    initMoneyInputs(config);
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface MoneyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type' | 'onBlur'> {
    /** Valor en centavos (ej: 23423 → "234.23"). */
    value?: number;
    /** Se llama con centavos en cada tecla del usuario. */
    onChange?: (cents: number) => void;
    /** Se llama al perder el foco con (centavos, texto formateado). */
    onMoneyChange?: (cents: number, formatted: string) => void;
    /** Número de decimales. Si no se pasa, usa la config global. */
    decimals?: number;
    /** Símbolo de moneda visible (ej: "Bs."). Solo informativo. */
    symbol?: string;
    /** Config global. Solo se aplica en la primera instancia montada. */
    config?: MoneyConfig;
}

// ─── Componente ───────────────────────────────────────────────────────────────
const MoneyInput = ({
    value = 0,
    onChange,
    onMoneyChange,
    decimals,
    symbol,
    config,
    id,
    className,
    disabled,
    ...rest
}: MoneyInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const ctrlRef = useRef<MoneyInputController | null>(null);
    // Evita que setCents dispare onChange mientras sincronizamos desde afuera
    const isInternalSet = useRef(false);

    // Mount: init global + activar input + valor inicial
    useEffect(() => {
        ensureGlobalInit(config);
        const input = inputRef.current;
        if (!input) return;

        const ctrl = activateMoneyInput(input);
        ctrlRef.current = ctrl;

        if (ctrl !== null && value !== 0) {
            isInternalSet.current = true;
            ctrl.setCents(value, false);
            requestAnimationFrame(() => { isInternalSet.current = false; });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sincronizar value externo → input (ej: abrir modal con datos existentes)
    useEffect(() => {
        const ctrl = ctrlRef.current;
        if (ctrl === null) return;
        if (ctrl.getCents() === value) return;

        isInternalSet.current = true;
        ctrl.setCents(value, false);
        requestAnimationFrame(() => { isInternalSet.current = false; });
    }, [value]);

    // money-input: cada tecla → onChange en centavos
    const handleMoneyInput = useCallback(
        (e: CustomEvent<{ value: number }>) => {
            if (isInternalSet.current) return;
            onChange?.(e.detail.value); // detail.value ya son centavos
        },
        [onChange],
    );

    // money-change: blur → onMoneyChange en centavos
    const handleMoneyChange = useCallback(
        (e: CustomEvent<{ value: number; formatted: string }>) => {
            onMoneyChange?.(e.detail.value, e.detail.formatted);
        },
        [onMoneyChange],
    );

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;
        const onInput   = (e: Event) => handleMoneyInput(e as CustomEvent<{ value: number }>);
        const onChanged = (e: Event) => handleMoneyChange(e as CustomEvent<{ value: number; formatted: string }>);
        input.addEventListener('money-input', onInput);
        input.addEventListener('money-change', onChanged);
        return () => {
            input.removeEventListener('money-input', onInput);
            input.removeEventListener('money-change', onChanged);
        };
    }, [handleMoneyInput, handleMoneyChange]);

    return (
        <Input
            {...rest}
            ref={inputRef}
            id={id}
            type="money"
            disabled={disabled}
            className={className}
            {...(decimals !== undefined ? { decimals: String(decimals) } : {})}
        />
    );
};

export default MoneyInput;