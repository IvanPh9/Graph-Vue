import { ref } from "vue"
import { Line } from "@/models/Line.js"
import { buttons, preventClick } from "./useButtons.js"
import { handleKeyPress } from "@/composables/useKeyboard.js"

export const lines = ref([])
export const previewLine = ref(null)


export function handleButtonClick(event, button) {
    if (preventClick.value) return // якщо був drag — ігноруємо click
    clickButtonToDrawLine(button)
}

function clickButtonToDrawLine(button) {
    const selectedButtons = buttons.value.filter(b => b.selected)

    if (!button.selected) {
        button.switchSeletcion(true)
    }
    if (selectedButtons.length === 1 && selectedButtons[0].id !== button.id) {
        for(const line of lines.value) {
            if ((line.fromButton.id === selectedButtons[0].id && line.toButton.id === button.id) ||
                (line.toButton.id === selectedButtons[0].id && line.fromButton.id === button.id)) {
                // Лінія вже існує
                selectedButtons[0].switchSeletcion(false)
                button.switchSeletcion(false)
                previewLine.value = null
                return
            }
        }
        // Друга кнопка вибрана — створюємо лінію
        lines.value.push(new Line(selectedButtons[0], button))
        console.log(lines.value)
        // Знімаємо вибір обох кнопок
        selectedButtons[0].switchSeletcion(false)
        button.switchSeletcion(false)

        previewLine.value = null
    }
}

export function onMouseMovePreview(event) {
    // ... решта вашої функції ...
    const selectedButtons = buttons.value.filter(b => b.selected)
    if (selectedButtons.length === 1) {
        const btn = selectedButtons[0]
        previewLine.value = {
            fromButton: btn,
            x: event.clientX,
            y: event.clientY
        }
    } else {
        previewLine.value = null
    }
}