### World Service – Angular API Demo

This is a small **Angular 21** application that demonstrates consuming several public APIs:

- **Countries**
  - List of countries with cards
  - Filter by **name** and **region**
  - Country details page
- **Weather**
  - Current weather by **city name**
- **Currency**
  - Exchange rates for a **base currency**
  - Base code synced to the URL via query params (e.g. `?base=USD`)
  - Basic in‑memory caching to avoid repeat requests

The project uses modern Angular features: **standalone components**, **signals**, **reactive forms**, **query params**, and simple **service‑level caching**.

---

### Setup

#### 1. Install dependencies

From the `angular-version` directory:

```bash
npm install
```

#### 2. Configure environment and API keys

The app reads configuration from `src/environment/environment.ts`.

1. Copy the example file:

```bash
cp src/environment/environment.example.ts src/environment/environment.ts
```

2. Open `src/environment/environment.ts` and replace the placeholders with **your own API keys**:

```ts
export const environment = {
  production: false,

  api: {
    countries: 'https://restcountries.com/v3.1/',
    weather: 'https://api.weatherapi.com/v1/',
    currency: 'https://v6.exchangerate-api.com/v6/',
  },

  keys: {
    weather: 'YOUR_WEATHER_API_KEY',
    currency: 'YOUR_CURRENCY_API_KEY',
  },
};
```

> `environment.ts` is **git‑ignored**, so real keys are not committed.

You can get free keys from:

- Weather: see `https://www.weatherapi.com/`
- Currency: see `https://www.exchangerate-api.com/`

---

### Run the app

From the `angular-version` directory:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

You can navigate via the header:

- **Countries**: browse and filter country cards; click a card for details.
- **Weather**: type a city name to see current conditions.
- **Currency**: type a 3‑letter code (`USD`, `EUR`, `UAH`, …).
