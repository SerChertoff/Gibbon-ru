// Дополнительные функции форматирования данных

/**
 * Форматирует большие числа с разделителями тысяч
 */
export const formatNumber = (num: number | string): string => {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('ru-RU').format(number);
};

/**
 * Форматирует дату в читаемый формат
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('ru-RU');
};

/**
 * Сокращает длинный текст
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

