<script lang="ts">
  import {
    Bodies,
    Composite,
    Engine,
    Render,
    Runner,
    Svg,
    Vertices,
    type IBodyDefinition,
  } from 'matter-js'
  import 'pathseg'

  const options = ({ texture }): IBodyDefinition => ({
    angle: Math.random() * 2 * Math.PI,
    render: {
      sprite: {
        texture,
        xScale: 0.5,
        yScale: 0.5,
      },
    },
    restitution: 0.4,
  })

  const pathToVertices = (path) =>
    Vertices.scale(Svg.pathToVertices(path), 0.5, 0.5)

  const bodyFromVertices = (x, y, vertices, texture) =>
    Bodies.fromVertices(x, y, [vertices], options({ texture }))

  const whole = (coords: [number, number]) =>
    Bodies.circle(...coords, 90, options({ texture: '/images/whole.png' }))
  const wholeWithBolt = (coords: [number, number]) =>
    Bodies.circle(
      ...coords,
      90,
      options({ texture: '/images/whole-with-bolt.png' }),
    )
  const threeQuarters = (coords: [number, number]) =>
    Bodies.circle(
      ...coords,
      90,
      options({ texture: '/images/three-quarters.png' }),
    )
  const threeQuartersWithBolts = (coords: [number, number]) =>
    Bodies.circle(
      ...coords,
      90,
      options({ texture: '/images/three-quarters-with-bolts.png' }),
    )
  const half = (coords: [number, number]) =>
    Bodies.circle(...coords, 90, options({ texture: '/images/half.png' }))
  const halfWithBolts = (coords: [number, number]) =>
    Bodies.circle(
      ...coords,
      90,
      options({ texture: '/images/half-with-bolts.png' }),
    )
  const square = (coords: [number, number]) =>
    Bodies.rectangle(
      ...coords,
      74,
      74,
      options({ texture: '/images/square.png' }),
    )
  const quarter = (coords: [number, number], node: HTMLElement) => {
    const quarterBody = pathToVertices(node.querySelector('#quarter-body'))
    return bodyFromVertices(
      ...coords,
      quarterBody,
      '/images/quarter-with-bolts.png',
    )
  }
  const slice = (coords: [number, number], node: HTMLElement) => {
    const sliceBody = pathToVertices(node.querySelector('#slice-body'))
    return bodyFromVertices(...coords, sliceBody, '/images/slice.png')
  }

  const bodies = [
    whole,
    wholeWithBolt,
    threeQuarters,
    threeQuartersWithBolts,
    half,
    halfWithBolts,
    square,
    square,
    square,
    quarter,
    quarter,
    slice,
    slice,
  ]

  const init = (node: HTMLElement) => {
    const engine = Engine.create()

    const width = node.clientWidth
    const height = node.clientHeight

    const render = Render.create({
      element: node,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      },
    })

    const holds = Array(25)
      .fill(null)
      .map(() => {
        const n = Math.floor(Math.random() * bodies.length)
        const x = Math.floor(Math.random() * width)
        const y = -Math.floor(Math.random() * height)
        return bodies[n]([x, y], node)
      })

    const ground = [
      Bodies.rectangle(width / 2, height, width, 10, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(0, 0, 10, height * 2, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(width, 0, 10, height * 2, {
        isStatic: true,
        render: { visible: false },
      }),
    ]

    Composite.add(engine.world, [...holds, ...ground])

    Render.run(render)

    const runner = Runner.create()

    Runner.run(runner, engine)
  }
</script>

<div use:init class="fixed inset-0">
  <svg
    width="267"
    height="189"
    viewBox="0 0 267 189"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="hidden"
  >
    <path
      id="slice-body"
      d="M266.198 55.9189C192.789 -17.4902 73.7695 -17.4902 0.360434 55.9189L133.279 188.838L266.198 55.9189Z"
    />
  </svg>
  <svg
    width="360"
    height="90"
    viewBox="0 0 360 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="hidden"
  >
    <path
      id="quarter-body"
      d="M90 180C279.411 180 360 99.4113 360 0L-1.57361e-05 3.14722e-05C-7.04529e-06 99.4113 80.5887 180 180 180Z"
    />
  </svg>
</div>
