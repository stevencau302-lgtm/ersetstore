export const formatPrice = (n: number): string =>
  'Rp ' + n.toLocaleString('id-ID');

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calcDiscount = (price: number, original?: number): number =>
  original ? Math.round((1 - price / original) * 100) : 0;
