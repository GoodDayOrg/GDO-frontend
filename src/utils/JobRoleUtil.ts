export const formatDate = (date?: Date): string => {
  return date == null
    ? 'N/A'
    : new Date(date).toLocaleDateString('pl-PL', {
        // you can use undefined as first argument
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
};
