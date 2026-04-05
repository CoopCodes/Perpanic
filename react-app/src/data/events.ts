import type { EventModel } from '../models/eventModel'

const galleryPaths = Object.keys(
  import.meta.glob('../../public/Gallery/**/*.{png,jpg,jpeg,webp}'),
)

function getImages(title: string): string[] {
  const needle = `/Gallery/${title}/`
  return galleryPaths
    .filter((p) => p.replace(/\\/g, '/').includes(needle))
    .map((p) => {
      const n = p.replace(/\\/g, '/')
      const i = n.indexOf('/Gallery/')
      return i >= 0 ? n.slice(i) : ''
    })
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

const events: EventModel[] = [
  {
    title: 'Vinnies dive bar',
    images: getImages('Vinnies dive bar'),
    location: 'Vinnies dive bar',
    date: new Date(2025, 8, 15),
  },
  {
    title: 'Greaser',
    images: getImages('Greaser'),
    location: 'Greaser',
    date: new Date(2026, 3, 26),
  },
]

export function getEvents(): EventModel[] {
  return events
}
