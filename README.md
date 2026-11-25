# XTRM Store

Tienda de gorras XTRM: https://www.xtrmoficial.com

React + Vite, functions de Vercel en `api/`, pagos con Wompi y avisos de pedido con Resend.

```
npm install
npm run dev
npm run lint
npm run build
node e2e/webhook.check.mjs   # revisión local de api/, sin red
```

- Variables de entorno: `.env.example`
- `npm run test:e2e` exige `E2E_BASE_URL` con un deploy que use llaves de **sandbox** de Wompi
- `node e2e/api-shim.mjs` sirve `api/` en local junto a `npm run dev` (`vercel dev` no funciona aquí)
- Los precios están en `src/data/products.js` y en `api/_catalog.js`: cambiar ambos
- Deploy manual: `vercel deploy --prod`
