export function formatCurrency(value) {
  const numericValue = Number(value || 0);

  return `৳${numericValue.toFixed(2)}`;
}

export function formatDateTime(value) {
  if (!value) {
    return 'No date available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getInitials(name, fallback = 'GC') {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return fallback;
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
