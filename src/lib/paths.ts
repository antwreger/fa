const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string) {
  if (/^(?:https?:)?\/\//.test(path)) return path;
  return `${base}/${path.replace(/^\/+/, '')}`;
}
