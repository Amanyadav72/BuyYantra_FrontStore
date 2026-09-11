/**
 * Formats numeric string or number into currency format (₹ INR)
 */
export function formatCurrency(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return '₹0.00';
  }

  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) {
    return '₹0.00';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
