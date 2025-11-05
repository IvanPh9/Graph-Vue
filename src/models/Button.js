import { magnit, width, height, center } from "@/composables/useConfig.js"
import { buttons } from "@/composables/useButtons.js"
import {centerChangeable} from "@/composables/useConfig.js";

export class Button {
    constructor(id, label, size, relativePos) {
        this.id = id
        this.label = label
        this.size = size
        this.color = "white"
        this.relativePos = { ...relativePos }
        this.selected = false
    }

    switchSeletcion(bool) {
        this.selected = bool
        this.color = this.selected ? "blue" : "white"
    }

    get position() {
        return {
            x: center.value.x + this.relativePos.x,
            y: center.value.y - this.relativePos.y
        }
    }

    setPositionFromAbsolute(x, y) {
        let relX = - (center.value.x - x)
        let relY = center.value.y - y

        relX = Math.round(relX / magnit.value) * magnit.value
        relY = Math.round(relY / magnit.value) * magnit.value

        const halfWidth = (width.value / 2 - this.size / 2)
        const halfHeight = (height.value / 2 - this.size / 2)

        relX = Math.min(Math.max(relX, -halfWidth - centerChangeable.value.x), halfWidth - centerChangeable.value.x)
        relY = Math.min(Math.max(relY, -halfHeight + centerChangeable.value.y), halfHeight + centerChangeable.value.y)

        for (const b of buttons.value) {
            const distance = Math.hypot(b.relativePos.x - relX, b.relativePos.y - relY)
            if (b.id !== this.id && distance < (b.size / 2 + this.size / 2)) {
                return
            }
        }

        this.relativePos.x = relX
        this.relativePos.y = relY
    }
}
