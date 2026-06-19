# Diabetic Diaries

A gentle, private daily diary for recording blood sugar, blood pressure, everyday notes, stickers, and photos.

## Features

- Blood glucose logging with meal timing
- Blood pressure and pulse tracking
- Custom postcard notes with fonts, paper styles, photos, and multiple stickers
- Visual memory boxes for filing and revisiting life notes
- Local health trends and a chronological reading archive
- Password lock and personal profile
- Mobile-friendly design

## Privacy

When Supabase is configured, Diabetic Diaries stores entries, attached photos, profile details, and the diary password hash in the signed-in user's private database row so the diary can sync across devices. Row-level security restricts each record to its owner. A local browser copy is also retained for continuity.

Without Supabase configuration, records remain only in that browser's local storage and do not sync across devices. The diary password hash is stored, but diary contents are not end-to-end encrypted, so do not reuse an important password.

This app is a personal record-keeping tool. It does not provide medical advice, diagnosis, or emergency monitoring.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add the Supabase project URL and publishable key to `.env.local`, then open the local address shown in the terminal.

The owner-only database schema is in `supabase/schema.sql`.

## Production build

```bash
npm ci
npm run build
```

The production files are generated in `dist`.

## Deploy on Render

This repository includes a Render Blueprint in `render.yaml`. Create a new Blueprint in Render and select this repository. Render will build the app with `npm ci && npm run build` and publish `dist`.
