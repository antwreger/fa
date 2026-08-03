import { site } from '../data/site';

export type InstagramTile = {
  id: string;
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

type InstagramMedia = {
  id?: string;
  caption?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
};

type InstagramResponse = {
  data?: InstagramMedia[];
  error?: {
    message?: string;
  };
};

export const fallbackInstagramPosts: InstagramTile[] = [
  { id: 'local-1', href: site.instagram.href, src: '/dsc_0176-scaled.jpg', alt: 'Antika föremål i butiken', width: 1920, height: 1280 },
  { id: 'local-2', href: site.instagram.href, src: '/dsc_0150-scaled.jpg', alt: 'Färgrika vintagehalsband', width: 1920, height: 1280 },
  { id: 'local-3', href: site.instagram.href, src: '/dsc_0195-scaled.jpg', alt: 'Vintagebijouterier från Christian Dior', width: 1920, height: 1280 },
  { id: 'local-4', href: site.instagram.href, src: '/dsc_0101-1-scaled.jpg', alt: 'Smycken och äldre accessoarer', width: 1920, height: 1280 },
  { id: 'local-5', href: site.instagram.href, src: '/dsc_0195-scaled.jpg', alt: 'Pärlor och vintagebijouterier', width: 1920, height: 1280 },
  { id: 'local-6', href: site.instagram.href, src: '/dsc_0101-1-scaled.jpg', alt: 'Äldre ringar och smycken', width: 1920, height: 1280 },
  { id: 'local-7', href: site.instagram.href, src: '/dsc_0176-scaled.jpg', alt: 'Detalj från butikens antika sortiment', width: 1920, height: 1280 },
  { id: 'local-8', href: site.instagram.href, src: '/dsc_0150-scaled.jpg', alt: 'Vintagehalsband i varma toner', width: 1920, height: 1280 },
  { id: 'local-9', href: site.instagram.href, src: '/dsc_0110-scaled.jpg', alt: 'Strassdiadem bland antika föremål', width: 2560, height: 1707 },
  { id: 'local-10', href: site.instagram.href, src: '/dsc_0168-scaled.jpg', alt: 'Antik ring med pärla', width: 2560, height: 1707 },
  { id: 'local-11', href: site.instagram.href, src: '/dsc_0166-scaled.jpg', alt: 'Äldre skyltdocka med diadem', width: 2560, height: 1916 },
  { id: 'local-12', href: site.instagram.href, src: '/dsc_0205-scaled.jpg', alt: 'Detalj av äldre porslin', width: 2560, height: 1707 },
  { id: 'local-13', href: site.instagram.href, src: '/dsc_0221-scaled.jpg', alt: 'Etikett på äldre whiskyflaska', width: 2560, height: 1707 },
];

function captionToAlt(caption?: string) {
  const cleaned = caption?.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Senaste nytt från Fåfängans Antik';

  return cleaned.length > 140 ? `${cleaned.slice(0, 137).trimEnd()}…` : cleaned;
}

export async function getInstagramPosts(limit = 13): Promise<InstagramTile[]> {
  const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
  const fallback = fallbackInstagramPosts.slice(0, limit);

  if (!token) return fallback;

  const endpoint = new URL('https://graph.instagram.com/me/media');
  endpoint.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink');
  endpoint.searchParams.set('limit', String(limit));
  endpoint.searchParams.set('access_token', token);

  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
    const payload = (await response.json()) as InstagramResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message ?? `Instagram svarade med ${response.status}`);
    }

    const posts = (payload.data ?? [])
      .map((post): InstagramTile | null => {
        const src = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
        if (!post.id || !src || !post.permalink) return null;

        return {
          id: post.id,
          href: post.permalink,
          src,
          alt: captionToAlt(post.caption),
          width: 1080,
          height: 1080,
        };
      })
      .filter((post): post is InstagramTile => post !== null);

    return posts.length > 0 ? posts : fallback;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'okänt fel';
    console.warn(`[Instagram] Kunde inte hämta flödet (${message}). Använder lokala bilder.`);
    return fallback;
  }
}
