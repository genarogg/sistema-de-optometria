import activateMoneyInput from './activateMoneyInput';

const initMoneyInputs = () => {
    document.querySelectorAll<HTMLInputElement>('input[type="money"]')
        .forEach(activateMoneyInput);

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                const el = node as Element;
                if (el.matches('input[type="money"]')) activateMoneyInput(el as HTMLInputElement);
                el.querySelectorAll<HTMLInputElement>('input[type="money"]').forEach(activateMoneyInput);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

export default initMoneyInputs;