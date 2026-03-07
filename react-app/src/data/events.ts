import type { EventModel } from '../models/eventModel'

const randomEventNames = [
  'Neon Skyline Fest',
  'Echoes at Midnight',
  'Sunset Groove',
  'The Velvet Room',
  'Electric Avenue',
  'Moonlight Sessions',
  'The Underground Beat',
  'Starlit Soirée',
]

const eventLocations = [
  'Vinnies dive bar',
  'Midnight Station',
  'The Loft at Eleven',
  'The Velvet Room',
  'Electric Avenue',
  'Moonlight Sessions',
  'The Underground Beat',
  'Starlit Soirée Stage',
]

const eventImages = [
  ['/gallery-image.png', '/gallery-image-2.png', '/gallery-image-3.png', '/gallery-image-4.png'],
  ['/gallery-image-5.png', '/gallery-image-6.png', '/gallery-image-7.png', '/gallery-image-8.png'],
  ['/gallery-image-9.png', '/gallery-image-10.png', '/gallery-image-11.png'],
  ['/gallery-image.png', '/gallery-image-2.png', '/gallery-image-3.png', '/gallery-image-4.png'],
  ['/gallery-image-5.png', '/gallery-image-6.png', '/gallery-image-7.png', '/gallery-image-8.png'],
  ['/gallery-image-9.png', '/gallery-image-10.png', '/gallery-image-11.png'],
  ['/gallery-image.png', '/gallery-image-2.png', '/gallery-image-3.png', '/gallery-image-4.png'],
  ['/gallery-image-5.png', '/gallery-image-6.png', '/gallery-image-7.png', '/gallery-image-8.png'],
]

function getRandomDate() {
  const start = new Date(2024, 0, 1).getTime()
  const end = new Date(2026, 11, 31).getTime()
  return new Date(start + Math.random() * (end - start))
}

export function getEvents(): EventModel[] {
  return eventImages.map((images, i) => ({
    title: randomEventNames[i],
    date: getRandomDate(),
    images,
    location: eventLocations[i],
  }))
}
