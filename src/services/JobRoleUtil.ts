export const formatDate = (date: Date): string => {
    return date == null ? "N/A" : new Date(date).toLocaleDateString();
}