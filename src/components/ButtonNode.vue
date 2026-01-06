<script setup>
import { startMoving } from "@/composables/useButtons.js"
import { handleButtonClick } from "@/composables/useLines.js"

const props = defineProps({
  button: Object
})
</script>

<template>
  <button
      class="absolute rounded-full border-3 border-gray-800"
      v-if="props.button.isShowed"
      @mousedown="e => startMoving(e, props.button)"
      @mousemove="props.button.hovered = true"
      @mouseleave="props.button.hovered = false"
      @click="e => handleButtonClick(e, props.button)"
      :style="{
      /* Використовуємо transform замість top/left для плавності */
      transform: `translate(${props.button.position.x}px, ${props.button.position.y}px) translate(-50%, -50%)`,
      /* Фіксуємо позицію в 0,0, щоб працював transform */
      top: 0,
      left: 0,
      width: props.button.computedSize + 'px',
      height: props.button.computedSize + 'px',
      backgroundColor: props.button.color,
      willChange: 'transform, width, height' /* Підказка браузеру для оптимізації */
    }">
  </button>
</template>