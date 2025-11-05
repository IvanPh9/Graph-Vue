// useButtons.js
import { ref } from "vue"
import { Button } from "@/models/Button.js"

export const buttons = ref([])

buttons.value.push(new Button(1, "A", 50, { x: 100, y: 100 }))
buttons.value.push(new Button(2, "B", 50, { x: 10, y: 10 }))
buttons.value.push(new Button(3, "C", 50, { x: -100, y: -100 }))

let draggingButton = null
let offsetX = 0
let offsetY = 0
export const preventClick = ref(false) // <-- Змінено на ref та експортовано

export function startMoving(event, button) {
    const selectedButtons = buttons.value.filter(b => b.selected)
    if (selectedButtons.length > 0) {
        return
    }
    draggingButton = button
    preventClick.value = false // <-- Використовуємо .value
    const pos = button.position
    offsetX = event.clientX - pos.x
    offsetY = event.clientY - pos.y

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", stopMoving)
}

function onMouseMove(event) {
    if (!draggingButton) return
    preventClick.value = true // <-- Використовуємо .value. Був рух — не виконувати click
    draggingButton.setPositionFromAbsolute(event.clientX - offsetX, event.clientY - offsetY)
}

function stopMoving(event) {
    if (draggingButton) {
        draggingButton.switchSeletcion(false) // після drag завжди знімаємо виділення
    }
    draggingButton = null
    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", stopMoving)
}