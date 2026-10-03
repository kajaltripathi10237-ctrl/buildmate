# BuildMate

BuildMate is a construction-tech mobile workspace for contractors, workers, vendors, and administrators. This repository includes:

- An Expo React Native mobile app for Android and iOS
- A REST backend with Prisma + PostgreSQL
- Render deployment configuration
- A production-minded starter structure for the BuildMate ecosystem

## Included

- Role-based dashboard switching between Contractor, Worker, Vendor, and Admin
- Jobs, marketplace, payments, and settings screens
- Render-ready API health check and database-backed backend
- Expo EAS configuration for preview builds

## Run locally

### Mobile app

```bash
cd mobile
npm install
npx expo start
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
node prisma/seed.js
node src/server.js
```

## Deploy

- Backend: render.com using the included Render configuration
- Mobile: Expo Application Services (EAS) using the EAS config in the mobile folder

## Notes

This is a real MVP foundation for the BuildMate ecosystem, designed to be extended into the full enterprise workflow described in the project brief.