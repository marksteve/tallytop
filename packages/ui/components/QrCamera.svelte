<script lang="ts">
  import { BrowserQRCodeReader, BrowserCodeReader } from '@zxing/browser'

  export let onScan = (code: string) => {
    console.log('Scanned code: ', code)
  }

  const readQr = (node) => {
    BrowserCodeReader.listVideoInputDevices().then((videoInputDevices) => {
      let selectedDeviceId = videoInputDevices[0].deviceId
      const codeReader = new BrowserQRCodeReader()
      codeReader.decodeFromVideoDevice(selectedDeviceId, node, (result, _error, controls) => {
        if (result) {
          controls.stop()
          onScan(result.getText())
        }
      })
    })
  }
</script>

<video use:readQr {...$$props} />
