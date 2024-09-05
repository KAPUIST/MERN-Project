export interface UserResponseRO {
  username: string;
  email: string;
  role?: "user" | "admin";
  createdAt: Date;
}
