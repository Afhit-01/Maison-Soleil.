# Maison Soleil — Your Stay

A guest portal for a holiday rental in Cassis, France. Static HTML/CSS with
vanilla JavaScript for interactivity.

## Pages

| Page | File | What it does |
|---|---|---|
| Your stay | `index.html` | Booking receipt, welcome note, wifi, live countdown to check‑in/out |
| The house | `house.html` | Amenities, room gallery (lightbox), house rules (accordion) |
| Around town | `around-town.html` | Local recommendations, filterable by category, live open/closed status |
| Breakfast | `breakfast.html` | Order form for terrace breakfast, with time-window validation |
| Messages | `messages.html` | Chat thread with the host, persisted locally |

## Running it

No build step.., open `index.html` directly in a browser, or serve the folder
with any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

A local server is recommended over opening the file directly (`file://`),
since a couple of features (clipboard copy, the live weather fetch) behave
more reliably when served over `http(s)`.

## Project structure

```
.
├── index.html          Your stay
├── house.html           The house
├── around-town.html     Around town
├── breakfast.html        Breakfast
├── messages.html          Messages
├── style.css              All styles — design tokens + page styles
└── js/
    ├── data.js          Single source of truth: booking, house, spots,
    │                    breakfast menu, seed messages
    ├── shared.js        Loaded on every page: nav highlighting, live
    │                    weather, clipboard helper, .ics generation,
    │                    unread-messages badge
    ├── stay.js          index.html only
    ├── house.js         house.html only
    ├── around-town.js   around-town.html only
    ├── breakfast.js     breakfast.html only
    └── messages.js       messages.html only
```

Each page loads `data.js` → `shared.js` → its own page script, in that
order, as plain `<script>` tags (no modules, so it works straight off the
filesystem or any static host without CORS issues).

## Features

**Your stay**
- Live countdown that switches between "arriving in…", "checking out
  in…", and a past-tense message once the stay is over
- "Add to calendar" builds a real `.ics` file client-side and downloads it
- "Print receipt" uses a dedicated `@media print` stylesheet that hides
  everything but the receipt
- Wifi password copy button — uses the Clipboard API where available,
  falls back to `document.execCommand` otherwise
- Barcode pattern is seeded from the confirmation code, so it's stable
  across reloads rather than re-randomising every time

**The house**
- Amenities and rules render from `data.js`, not hardcoded markup
- Gallery lightbox: click a tile, navigate with the arrow buttons or
  ← / → keys, close with Esc, the close button, or a click outside the
  frame
- Rules accordion is keyboard-accessible (`aria-expanded`,
  `aria-controls`, focus outlines)

**Around town**
- Category filter tabs (All / Eat / See / Do / Beach)
- Each spot's "open now" / "closed" status is calculated from the
  visitor's local clock against that spot's hours, and re-checks every
  minute in case the tab is left open across a status change

**Breakfast**
- Menu renders from `data.js`
- Delivery time is constrained to the 8:00–10:30 serving window, with
  inline validation
- Submitted orders are saved to `localStorage` and shown as a summary
  card; a "Clear order" option resets it

**Messages**
- Chat thread persisted in `localStorage`, so it survives a refresh
- Sending a message shows a "Margaux is typing…" indicator, then a
  simulated reply after a short delay — replies are keyword-matched
  (mentions of "wifi", "breakfast", "cat", etc. get relevant answers)
- Unread-message count badges the "Messages" item in the sidebar on
  every page, and clears once the Messages page has been opened

## Data model

Everything content-related (the booking, the house guide, local
recommendations, the breakfast menu, and the seed conversation) lives in
`js/data.js` as one plain object (`window.MS_DATA`). To change any of the
guest-facing content (new dates, a different room, more amenities, more
spots around town), that's the only file you need to touch; the pages
render from it rather than repeating the data in markup.

## Local storage keys

| Key | Written by | Purpose |
|---|---|---|
| `ms_breakfast_order` | `breakfast.js` | The current saved breakfast order |
| `ms_messages` | `messages.js` | The full message thread |
| `ms_messages_last_read` | `messages.js` | Timestamp used to compute the unread badge |

Clearing these (or clearing site data in devtools) resets each feature
back to its default state.

## Browser support

Built against evergreen browsers (Chrome, Safari, Firefox, Edge, current
versions). Uses `fetch`, the Clipboard API (with a fallback), CSS Grid,
and `localStorage`. No polyfills included.

## Notes on the weather card

The temperature and conditions are fetched live from
[Open-Meteo](https://open-meteo.com/) (no API key required) for Cassis,
France, and update the card on load. If the request fails or is blocked
(offline, ad-blocker, `file://` restrictions in some browsers), the card
falls back to the static values already in the HTML — it fails quietly
rather than breaking the page.
