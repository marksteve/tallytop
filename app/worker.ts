import QR from 'jsqr'

export function parseQR(imgData) {
  return QR(imgData.data, imgData.width, imgData.height)
}
