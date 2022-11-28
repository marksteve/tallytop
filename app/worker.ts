import reduce from 'image-blob-reduce'
export { default as parseQR } from 'jsqr'

export function reduceBlob(blob) {
  return reduce().toBlob(blob, { max: 512 })
}
