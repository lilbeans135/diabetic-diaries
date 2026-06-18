# Diabetic Diaries

A gentle, private daily diary for recording blood sugar, blood pressure, everyday notes, stickers, and photos.

## Features

- Blood glucose logging with meal timing
- Blood pressure and pulse tracking
- Life notes with moods, stickers, and photo attachments
- Local trends and a chronological archive
- Password lock and personal profile
- Mobile-friendly design

## Privacy

Diabetic Diaries stores entries, profile details, attached photos, and the password hash in the browser's local storage. Data is not uploaded to a server, but it is not encrypted. Clearing site data, switching browsers or devices, or using a different domain will not preserve existing entries.

This app is a personal record-keeping tool. It does not provide medical advice, diagnosis, or emergency monitoring.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Production build

```bash
npm ci
npm run build
```

The production files are generated in `dist`.

## Deploy on Render

This repository includes a Render Blueprint in `render.yaml`. Create a new Blueprint in Render and select this repository. Render will build the app with `npm ci && npm run build` and publish `dist`.
