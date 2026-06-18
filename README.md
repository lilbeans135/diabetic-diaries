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

Diabetic Diaries stores entries, attached photos, and the password hash in the browser's local storage. Profile details are stored under a key derived from the saved password hash, so the matching profile loads after unlock. Data is not uploaded to a server, but it is not encrypted. Clearing site data, switching browsers or devices, or using a different domain will not preserve existing entries.

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
