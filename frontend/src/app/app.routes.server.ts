import { RenderMode, ServerRoute } from '@angular/ssr';

// src/app/app.routes.server.ts
export const routes = [
  {
    path: '**',
    prerender: true,
  },
];
