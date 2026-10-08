# Deploy the replacement

1. Put this folder in your own GitHub repository.
2. Deploy `backend` to a Node 24 service with a persistent disk. Build: `npm ci`. Start: `npm start`. Set PORT as provided by the host, DATABASE_PATH to a file on that persistent disk, FRONTEND_ORIGIN to your final frontend HTTPS URL, and COOKIE_SECURE=true. The server listens on 0.0.0.0.
3. Deploy `frontend` to Vercel, using Next.js detection. Set BACKEND_URL to the backend HTTPS origin and NEXT_PUBLIC_STANDALONE=true. Build: `npm run build`.
4. Update backend FRONTEND_ORIGIN if Vercel gives you a different frontend domain.
5. Test registration, sign-out/sign-in, booking, checkout simulation and page refresh on the deployed frontend.
6. Add GEMINI_API_KEY to the backend environment if you want actual model-generated concierge answers. Restart backend. Never expose it as a NEXT_PUBLIC variable.
7. For the same original Vercel URL, redeploy within the original Vercel project; a new project creates a new URL.

Wema payments remain simulations. Bank-approved sandbox/merchant credentials and the full assigned API contract are needed before real bank integration. Official references: https://playground.alat.ng/api-pay-with-bank-account and https://playground.alat.ng/. Never accept a browser success message as proof of payment.
