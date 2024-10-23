export function useFormatCurrency() {
  const formatCurrency = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return "₱0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(numericValue);
  };

  return { formatCurrency };
}
