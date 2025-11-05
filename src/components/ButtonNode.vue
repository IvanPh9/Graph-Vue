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
      @mousedown="e => startMoving(e, props.button)"
      @click="e => handleButtonClick(e, props.button)"
      :style="{
      left: props.button.position.x + 'px',
      top: props.button.position.y + 'px',
      transform: 'translate(-50%, -50%)',
      width: props.button.size + 'px',
      height: props.button.size + 'px',
      backgroundColor: props.button.color
    }">
  </button>
</template>