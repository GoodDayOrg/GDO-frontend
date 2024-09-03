export enum UserRole {
  Admin = 1,
  User = 2,
}

export type JwtToken = {
  role_id: UserRole;
};
