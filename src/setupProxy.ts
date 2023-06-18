import { createProxyMiddleware } from 'http-proxy-middleware';
import { Application } from 'express';

export default function setupProxy(app: Application) {
  app.use(
    '/api', // Путь, на который будут перенаправляться запросы
    createProxyMiddleware({
      target: 'https://emmarrat.app.n8n.cloud', // Целевой адрес n8n
      changeOrigin: true,
    })
  );
}
