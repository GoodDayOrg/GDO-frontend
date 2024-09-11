export const getHeader = (
  token: String,
): { headers: { Authorization: string } } => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
