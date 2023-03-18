<script lang="ts">
  import parseMs from 'parse-ms'
  import { onDestroy, onMount } from 'svelte'
  import { formatDuration } from './Timer.svelte'

  export let to: Date = new Date(Date.now() + 1000 * 60 * 60 * 24)

  let frame
  let duration

  const update = () => {
    frame = requestAnimationFrame(update)
    duration = formatDuration(parseMs(to.getTime() - Date.now()))
  }

  onMount(() => update())

  onDestroy(() => {
    frame && globalThis?.cancelAnimationFrame(frame)
  })
</script>

{duration}
