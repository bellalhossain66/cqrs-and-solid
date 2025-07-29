import dotenv from 'dotenv';
import { AppConstType } from '../../core/domain/interfaces/appconst.interface';

dotenv.config({ quiet: true });
const dbName = process.env.DB_DATABASE ?? '';
const dbPrefix = `\`${dbName}\``;

const appConst: AppConstType = {
    app: {
        app_url: process.env.APP_URL ?? '',
        app_name: process.env.APP_NAME ?? 'prowhats_chat',
    },
    mysql: {
        db_name: dbName,
        db_user: process.env.DB_USERNAME ?? '',
        db_pass: process.env.DB_PASSWORD ?? '',
        db_host: process.env.DB_HOST ?? 'localhost',
    },
    redis: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASS || undefined,
    }
}

export default appConst;