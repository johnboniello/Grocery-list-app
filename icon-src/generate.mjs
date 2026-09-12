import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = (name) => fileURLToPath(new URL(name, import.meta.url))

const iconsOut = fileURLToPath(new URL('../public/icons/', import.meta.url))
mkdirSync(iconsOut, { recursive: true })
const iconsFile = (name) => src(`../public/icons/${name}`)

await sharp(src('./icon.svg')).resize(192, 192).png().toFile(iconsFile('icon-192.png'))
await sharp(src('./icon.svg')).resize(512, 512).png().toFile(iconsFile('icon-512.png'))
await sharp(src('./icon-maskable.svg')).resize(512, 512).png().toFile(iconsFile('maskable-512.png'))
await sharp(src('./icon.svg')).resize(180, 180).png().toFile(iconsFile('apple-touch-icon.png'))
await sharp(src('./icon.svg')).resize(32, 32).png().toFile(iconsFile('favicon-32.png'))

const assetsOut = fileURLToPath(new URL('../assets/', import.meta.url))
mkdirSync(assetsOut, { recursive: true })
const assetsFile = (name) => src(`../assets/${name}`)

await sharp(src('./icon.svg')).resize(1024, 1024).png().toFile(assetsFile('icon.png'))
await sharp(src('./icon-foreground.svg')).resize(1024, 1024).png().toFile(assetsFile('icon-foreground.png'))
await sharp(src('./icon-background.svg')).resize(1024, 1024).png().toFile(assetsFile('icon-background.png'))
await sharp(src('./splash.svg')).resize(2732, 2732).png().toFile(assetsFile('splash.png'))

console.log('Icons and native asset sources generated.')
