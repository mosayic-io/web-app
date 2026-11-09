<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()

const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/25'

const variantClasses: Record<Variant, string> = {
  primary: 'text-accent-ink bg-accent hover:bg-accent-hover',
  secondary: 'text-ink bg-card border border-line hover:bg-sunken',
  ghost: 'text-muted hover:text-ink hover:bg-sunken',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-[15px] gap-2.5',
}

const classes = computed(() => [base, variantClasses[props.variant], sizeClasses[props.size]])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="classes"
    @click="$emit('click', $event)"
  >
    <span
      v-if="loading"
      class="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
