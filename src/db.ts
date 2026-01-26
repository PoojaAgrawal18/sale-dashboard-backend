import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'NestJS App',
  env: process.env.APP_ENV || 'local',
  url: process.env.APP_URL || 'localhost',
  port: process.env.APP_PORT || 5000,
  frontendUrl: process.env.FRONTEND_URI,
}));
 