import {buttons} from "@/composables/useButtons.js";
import {previewLine} from "@/composables/useLines.js";

export function handleKeyPress(event) {
    if (event.key === "Escape") {
        for(const b of buttons.value) {
            if (b.selected) b.switchSeletcion(false)
        }
        previewLine.value = null
    }
}