import reduce from 'image-blob-reduce'
import QR from 'jsqr'

export function reduceBlob(blob) {
  return reduce().toBlob(blob, { max: 512 })
}

export function parseQR(imgData) {
  return QR(imgData.data, imgData.width, imgData.height)
}
