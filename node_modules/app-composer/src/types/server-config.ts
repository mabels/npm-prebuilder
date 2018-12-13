export interface UserPassword {
  password: string;
  user: string;
}

export interface ServerConfig {
  authUsers?: UserPassword[];
  port: number;
  baseUrl?: string;
  cors?: RegExp[];
  crsfCookieDomain?: string;
}
