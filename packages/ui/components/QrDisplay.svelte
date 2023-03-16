<script lang="ts">
  import qrcode from 'qrcode-generator-es6'

  export let data: string = ''

  const createQr = (node) => {
    const qr = new qrcode(0, 'H')
    qr.addData(data)
    qr.make()
    node.innerHTML = qr.createSvgTag({})
  }
</script>

<div use:createQr />
