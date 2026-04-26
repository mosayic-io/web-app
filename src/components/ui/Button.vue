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
  'inline-flex items-center justify-center font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-3'

const variantClasses: Record<Variant, string> = {
  primary: 'text-white bg-accent hover:bg-accent-hover focus:ring-accent/30',
  secondary:
    'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 focus:ring-accent/20',
  ghost:
    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-accent/20',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
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
