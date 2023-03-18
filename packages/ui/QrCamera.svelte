<script lang="ts">
  import { BrowserQRCodeReader } from '@zxing/browser'
  import { BrowserCodeReader } from '@zxing/browser'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let controls

  const decode = async (node) => {
    const devices = await BrowserCodeReader.listVideoInputDevices()
    let deviceId = devices[0].deviceId
    for (const device of devices) {
      if (device.label.includes('back')) {
        deviceId = device.deviceId
      }
    }
    const codeReader = new BrowserQRCodeReader()
    controls = await codeReader.decodeFromVideoDevice(deviceId, node, (result, _error) => {
      if (result) {
        controls.stop()
        dispatch('scan', result.getText())
      }
    })
  }

  const camera = (node) => {
    decode(node)
  }
</script>

<video use:camera {...$$props} />
