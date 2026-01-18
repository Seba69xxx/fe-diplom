export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDuration = (seconds) => {
  if (!seconds) return '';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const hDisplay = hours > 0 ? `${hours} ч ` : '';
  const mDisplay = minutes > 0 ? `${minutes} мин` : '';
  return (hDisplay + mDisplay).trim();
};

export const formatDurationColons = (seconds) => {
  if (!seconds) return '';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}:${String(minutes).padStart(2, '0')}`;
};

export const formatPrice = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value);
};