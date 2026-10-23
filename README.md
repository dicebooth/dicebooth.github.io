# dicebooth links 🎲🔗

Web application statica multi-tenant basata su architettura **Config-as-Code** con supporto a molteplici utenti, eventi/pagine dedicate, Brand Presets ufficiali e tracciamento Google Analytics 4 (GA4).

---

## 🚀 Caratteristiche Principali

- **Config-as-Code**: Nessun database richiesto; tutte le pagine, profili ed eventi sono definiti in file versionati YAML in `config/users/`.
- **Multi-Tenant & Multi-Event**: Supporta profilo personale (`/` e `/me`), profili utente (`/[user]`) ed eventi specifici (`/[user]/[event]`).
- **Brand Presets Ufficiali**: Colori HEX, gradienti ufficiali, loghi vettoriali e contrasti WCAG pronti per:
  - Instagram, Spotify, YouTube, TikTok, LinkedIn, X, WhatsApp, Telegram, GitHub.
- **Pulsanti Custom & Highlight**: Supporto per icone Lucide, colori personalizzati e stati di evidenziazione (`highlight: true`).
- **Temi Multipli**: Supporto per tema `dark` (ambient glow), `light` e `minimal`.
- **Tracciamento GA4 Client-Side**: Tracciamento dell'evento `linklist_click` con metadati estesi (`link_id`, `link_type`, `link_label`, `destination_url`, `user_slug`, `page_slug`).
- **Static Site Generation (SSG)**: Esportazione in `dist/` compatibile con Google Cloud Storage e Cloud CDN con clean URLs (`trailingSlash: true`).

---

## 📁 Struttura Directory

```text
├── config/
│   └── users/
│       ├── me/                      # LinkList principale dell'amministratore
│       │   ├── main.yaml            # Pagina radice / e /me
│       │   ├── conference-2026.yaml # /me/conference-2026
│       │   └── keynote.yaml         # /me/keynote
│       └── mario/                   # Utente secondario
│           ├── main.yaml            # /mario
│           └── rockfest-2026.yaml   # /mario/rockfest-2026
├── src/
│   ├── app/
│   │   ├── [user]/
│   │   │   ├── [event]/
│   │   │   │   └── page.tsx         # Route per /[user]/[event]
│   │   │   └── page.tsx             # Route per /[user]
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Route radice (/) -> me/main.yaml
│   ├── components/
│   │   ├── Avatar.tsx               # Immagine profilo con glow e fallback
│   │   ├── BrandIcon.tsx            # Icone SVG vettoriali ufficiali brand
│   │   ├── BrandLinkButton.tsx      # Renderer pulsanti brand preset
│   │   ├── GenericLinkButton.tsx    # Renderer pulsanti custom / evento
│   │   ├── GoogleAnalytics.tsx      # Script gtag.js GA4
│   │   ├── IconRenderer.tsx         # Renderer icone Lucide
│   │   ├── LinkButton.tsx           # Router grafico tra Preset e Custom
│   │   ├── LinkListPage.tsx         # Template completo profilo LinkList
│   │   └── ThemeWrapper.tsx         # Gestore temi (dark, light, minimal)
│   ├── constants/
│   │   └── brand-presets.ts         # Registro centralizzato stili brand
│   └── lib/
│       ├── analytics.ts             # Dispatcher evento GA4 linklist_click
│       └── config-loader.ts         # Lettore e parser YAML a build-time
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🛠️ Installazione e Sviluppo

```bash
# Installazione dipendenze
pnpm install

# Avvio server di sviluppo
pnpm dev

# Compilazione statica di produzione (SSG in dist/)
pnpm build
```

---

## 📝 Configurazione YAML

Ogni file YAML in `config/users/<user>/` accetta la seguente struttura:

```yaml
meta:
  title: "Mario @ Rockfest 2026"
  description: "Tutti i link utili per le giornate del festival"
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
  theme: "dark" # dark | light | minimal
  ga_id: "G-XXXXXXXXXX" # Facoltativo (override di NEXT_PUBLIC_GA_ID)
links:
  # 1. Pulsante Download Foto Dinamico (mostrato solo se è presente il parametro GET ?photo=<id>)
  - id: "photo_download"
    label: "Scarica la tua foto 📸"
    url: "https://example.com/download/{photo}" # supporta {photo} o {id}
    icon: "download"

  # 2. Pulsante Custom con evidenziazione
  - id: "buy_ticket"
    label: "Biglietti Ufficiali Rockfest"
    url: "https://ticket.example.com/mario"
    icon: "ticket"
    highlight: true

  # 3. Pulsante Custom con colori specifici
  - id: "stage_map"
    label: "Mappa dei Palchi e Stand"
    url: "https://rockfest.com/maps"
    icon: "map-pin"
    style:
      bg_color: "#18181b"
      text_color: "#f4f4f5"

  # 4. Pulsanti Brand Preset Ufficiali
  - id: "spotify_playlist"
    preset: "spotify"
    url: "https://open.spotify.com/playlist/xyz"
    label: "Ascolta la mia Scaletta Ufficiale" # label facoltativa

  - id: "instagram_profile"
    preset: "instagram"
    url: "https://instagram.com/mario"

  - id: "tiktok_profile"
    preset: "tiktok"
    url: "https://tiktok.com/@mario"

  - id: "contact_email"
    label: "Contattami per Booking"
    url: "mailto:booking@mario.test"
    icon: "mail"
```

### 📸 Link Dinamico di Download Foto tramite Parametro GET (`?photo=<id>`)

È possibile definire link che vengono **mostrati esclusivamente** quando l'utente atterra sulla pagina con il parametro GET `?photo=...` (ad esempio tramite scansione di un QR code stampato dalla photobooth):

- **Placeholder supportati**: `{photo}` e `{id}` sia nel campo `url` che nel campo `label`.
- **Comportamento**:
  - Se il parametro `?photo=XYZ` è presente nella query string dell'URL (es. `https://links.dicebooth.com/nome_cliente/nome_evento?photo=DSC_1234`), il pulsante viene inserito con l'URL e la label valorizzati.
  - Se il parametro `photo` non è presente o è vuoto, il pulsante viene automaticamente **nascosto**.
  - Il tracciamento su Google Analytics 4 registra l'evento con il `destination_url` effettivo contenente l'ID della foto.

---

## 📊 Evento Tracciato su Google Analytics 4

Ad ogni click sui pulsanti viene emesso:

```javascript
gtag('event', 'linklist_click', {
  link_id: link.id,                     // es. "spotify_playlist" o "buy_ticket"
  link_type: link.preset || 'generic',  // es. "spotify", "instagram", "generic"
  link_label: link.label || preset.defaultLabel,
  destination_url: link.url,
  user_slug: currentUser,               // es. "mario"
  page_slug: currentEvent,              // es. "rockfest-2026"
  transport_type: 'beacon'
});
```
