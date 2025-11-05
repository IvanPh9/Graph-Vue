<script setup>
const props = defineProps({
  line: Object
})
</script>

<template>
  <polyline
      :points="`${props.line.fromButton.position.x},${props.line.fromButton.position.y}
              ${props.line.toButton.position.x},${props.line.toButton.position.y}`"
      :stroke="props.line.color"
      :stroke-width="props.line.width"
      fill="none"
  />
</template>
