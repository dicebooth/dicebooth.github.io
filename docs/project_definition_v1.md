# Specifiche Tecniche e Requisiti: Custom LinkList Multi-Tenant Statico con Analytics & Brand Presets

## 1. Panoramica del Progetto
Realizzazione di una web application statica responsive (stile Linktree) multi-tenant basata su architettura "Config-as-Code". 
Il sistema consente la gestione del profilo principale personale e di profili dedicati per molteplici utenti, ciascuno con supporto a molteplici pagine/eventi. 
Tutte le configurazioni risiedono in file YAML versionati. Non è previsto alcun database; il tracciamento delle interazioni e delle visualizzazioni è interamente delegato a Google Analytics 4 (GA4) tramite tracking client-side.

L'interfaccia deve supportare:
1. **Pulsanti Generici / Custom:** Personalizzabili a livello di stile, colore, icona ed enfasi.
2. **Pulsanti Brand Preset:** Collegamenti ricorrenti (es. Instagram, Spotify, YouTube, LinkedIn, X, TikTok) con grafica preconfigurata secondo le linee guida ufficiali del brand (colori HEX ufficiali, icone SVG vettoriali accurate, hover state e contrasti conformi).

---

## 2. Architettura & Scelte Tecnologiche

- **Framework Frontend:** React con Vite oppure Next.js (configurato con `output: 'export'` per Static Site Generation pura).
- **Styling:** Tailwind CSS per un design responsive, mobile-first e leggero.
- **Config Parser:** `js-yaml` per il parsing dei file YAML a build-time.
- **Iconografia:** `lucide-react` per icone generiche d'interfaccia + libreria/componenti SVG dedicati per loghi social ufficiali (es. `react-icons/si` - Simple Icons).
- **Analytics:** Google Analytics 4 (`gtag.js`) eseguito interamente lato client nel browser dell'utente.
- **Hosting di Riferimento:** Google Cloud Storage (Bucket configurato come static website) servito tramite Cloud CDN / Load Balancer (oppure Cloud Run con Nginx Alpine e `min-instances=0`).

---

## 3. Struttura delle Directory e Nomenclatura File

```text
├── config/
│   └── users/
│       ├── me/                      # LinkList principale dell'amministratore
│       │   ├── main.yaml            # Pagina radice/principale
│       │   ├── conference-2026.yaml # Evento specifico
│       │   └── keynote.yaml
│       └── mario/                   # Utente secondario
│           ├── main.yaml
│           └── rockfest-2026.yaml
├── src/
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── LinkButton.tsx           # Router grafico tra Preset e Custom
│   │   ├── BrandLinkButton.tsx      # Renderer pulsanti con linee guida brand
│   │   ├── GenericLinkButton.tsx    # Renderer pulsanti custom/evento
│   │   └── ThemeWrapper.tsx
│   ├── constants/
│   │   └── brand-presets.ts         # Registro centralizzato stili brand
│   ├── lib/
│   │   ├── analytics.ts
│   │   └── config-loader.ts
│   └── ...

```

---

## 4. Registro Centralizzato dei Brand Preset (`brand-presets.ts`)

Per evitare duplicazioni nei file YAML, le regole grafiche dei brand noti sono centralizzate nel codice.

### Specifiche dei Brand Supportati:

| Brand Key | Nome Visualizzato | Colore Sfondo (Brand Guideline) | Colore Testo | Icona Ufficiale |
| --- | --- | --- | --- | --- |
| `instagram` | Instagram | `bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]` | `#FFFFFF` | Instagram Glyph |
| `spotify` | Spotify | `#1DB954` | `#000000` o `#FFFFFF` (WCAG) | Spotify Wordmark/Icon |
| `youtube` | YouTube | `#FF0000` | `#FFFFFF` | YouTube Play |
| `tiktok` | TikTok | `#000000` (con accenti `#00F2FE` / `#FE2C55`) | `#FFFFFF` | TikTok Note |
| `linkedin` | LinkedIn | `#0A66C2` | `#FFFFFF` | LinkedIn In |
| `x` | X (Twitter) | `#000000` (Bordo `#2F3336`) | `#FFFFFF` | X Logo |
| `whatsapp` | WhatsApp | `#25D366` | `#FFFFFF` | WhatsApp Bubble |
| `telegram` | Telegram | `#229ED9` | `#FFFFFF` | Telegram Plane |
| `github` | GitHub | `#24292F` | `#FFFFFF` | GitHub Octocat |

### Struttura TypeScript del Preset:

```typescript
export interface BrandStyle {
  labelDefault: string;
  bgColor: string;
  textColor: string;
  hoverClass: string;
  iconName: string;
}

export const BRAND_PRESETS: Record<string, BrandStyle> = {
  instagram: {
    labelDefault: "Seguimi su Instagram",
    bgColor: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]",
    textColor: "text-white",
    hoverClass: "hover:opacity-95 hover:shadow-lg",
    iconName: "instagram"
  },
  spotify: {
    labelDefault: "Ascolta su Spotify",
    bgColor: "bg-[#1DB954]",
    textColor: "text-black",
    hoverClass: "hover:brightness-105",
    iconName: "spotify"
  },
  // Altri brand...
};

```

---

## 5. Specifiche del File di Configurazione YAML

I pulsanti supportano due modalità:

1. **Modalità Preset (`preset: <brand_id>`):** Eredita automaticamente palette, logo e stile ufficiale del brand. Il campo `label` è facoltativo (se omesso usa quello di default del preset).
2. **Modalità Custom (senza preset o generica):** Consente la definizione manuale di testo, icone generiche, stati di evidenziazione (`highlight`) e colori personalizzati.

### Esempio YAML Completo (`config/users/mario/rockfest-2026.yaml`):

```yaml
meta:
  title: "Mario @ Rockfest 2026"
  description: "Tutti i link utili per le giornate del festival"
  avatar: "[https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200](https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200)"
  theme: "dark" # dark | light | minimal

links:
  # --- 1. Pulsanti Specifici Evento (Custom / Generici) ---
  - id: "buy_ticket"
    label: "Biglietti Ufficiali Rockfest"
    url: "[https://ticket.example.com/mario](https://ticket.example.com/mario)"
    icon: "ticket"
    highlight: true # Stile primario in risalto
    active: true

  - id: "stage_map"
    label: "Mappa dei Palchi e Stand"
    url: "[https://rockfest.com/maps](https://rockfest.com/maps)"
    icon: "map-pin"
    style:
      bg_color: "#18181b"
      text_color: "#f4f4f5"

  # --- 2. Pulsanti Brand Preset (Linee Guida Ufficiali) ---
  - id: "spotify_playlist"
    preset: "spotify" # Aggancia lo stile ufficiale Spotify
    url: "[https://open.spotify.com/playlist/xyz](https://open.spotify.com/playlist/xyz)"
    label: "Ascolta la mia Scaletta Ufficiale" # Override facoltativo della label

  - id: "instagram_profile"
    preset: "instagram" # Aggancia il gradiente ufficiale e icona IG
    url: "[https://instagram.com/mario](https://instagram.com/mario)"

  - id: "tiktok_profile"
    preset: "tiktok"
    url: "[https://tiktok.com/@mario](https://tiktok.com/@mario)"

  - id: "contact_email"
    id: "email_booking"
    label: "Contattami per Booking"
    url: "mailto:booking@mario.test"
    icon: "mail"

```

---

## 6. Logica dei Componenti UI

Il componente `LinkButton.tsx` deve discriminare la natura del link:

```tsx
export default function LinkButton({ link, user, event }: LinkButtonProps) {
  if (link.preset && BRAND_PRESETS[link.preset]) {
    return <BrandLinkButton event="{event}" link="{link}" preset="{BRAND_PRESETS[link.preset]}" user="{user}"/>;
  }
  return <GenericLinkButton event="{event}" link="{link}" user="{user}"/>;
}

```

* **Pulsante Brand Preset:** Usa classi e proprietà del preset (`BRAND_PRESETS`). Garantisce padding coerente, allineamento del logo a sinistra e centratura del testo.
* **Pulsante Generico:** Rispetta il tema globale della pagina (es. `dark` o `light`). Se `highlight: true`, applica un'animazione sottile o un risalto cromatico (es. glow o bordo accentato).

---

## 7. Requisiti di Tracciamento Google Analytics 4 (GA4)

Il tracciamento distingue sia i link specifici dell'evento che i social ufficiali, mantenendo il medesimo schema di metadati.

### Chiamata Evento al Click:

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

---

## 8. Specifiche di Routing e Generazione Statica (SSG)

* A build-time, il generatore legge la directory `config/users/`:
* `config/users/me/main.yaml` $\rightarrow$ `/` e `/me`
* `config/users/me/[evento].yaml` $\rightarrow$ `/me/[evento]`
* `config/users/[utente]/main.yaml` $\rightarrow$ `/[utente]`
* `config/users/[utente]/[evento].yaml` $\rightarrow$ `/[utente]/[evento]`


* Output atteso in `dist/` compatibile con Google Cloud Storage e Cloud CDN (ogni pagina compilata come `index.html` all'interno della rispettiva cartella per garantire URL puliti senza estensione `.html`).