export interface AppConstType {
    app: { app_url: string; app_name: string };
    mysql: { db_name: string; db_user: string; db_pass: string; db_host: string };
    redis: { host: string; port: number; password?: string };
}