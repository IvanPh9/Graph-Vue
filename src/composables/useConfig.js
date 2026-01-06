import { ref, computed } from "vue"

export const width = ref(1300)
export const height = ref(700)
export const margin = ref(10)
export const magnit = ref(5)

export const centerChangeable = ref({ x: 0, y: 0 })

export const center = computed(() => ({
    x: (width.value / 2) + centerChangeable.value.x,
    y: (height.value / 2) + centerChangeable.value.y
}))

export function increaseMagnit() {
    magnit.value += 5
}

export function decreaseMagnit() {
    magnit.value = Math.max(5, magnit.value - 5)
}
