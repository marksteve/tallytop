import { cva, type VariantProps } from 'class-variance-authority'

export const list = cva(['grid', '[grid-auto-rows:20vh]'])

export const listItem = cva([
  'bg-white',
  'border-current',
  'border-t',
  'flex',
  'items-center',
  'justify-center',
  'shadow-lg',
])

export const button = cva(['bg-slate-200', 'p-2', 'text-center'], {
  variants: {
    variant: {
      primary: ['text-white', 'bg-slate-600'],
    },
    disabled: {
      true: ['text-slate-400', 'bg-slate-200/50'],
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      disabled: true,
      class: ['!text-slate-400', '!bg-slate-200/50'],
    },
  ],
})

export type ButtonProps = VariantProps<typeof button>
