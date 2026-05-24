const centsToDisplay = (cents: number, decimals: number): string => {
  if (decimals === 0) {
    const str = String(cents);
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const factor = Math.pow(10, decimals);
  const intPart = Math.floor(cents / factor);
  const decPart = cents % factor;

  const intStr = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decStr = String(decPart).padStart(decimals, '0');
  return `${intStr}.${decStr}`;
};

export default centsToDisplay;