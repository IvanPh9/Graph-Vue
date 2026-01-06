// /models/Button.js
import { ref, computed, reactive, unref } from "vue" // <-- Імпортуємо інструменти Vue

export class Button {

    constructor(id, label, size, relativePos, externalRefs) {

        const {
            width, height, center,
            centerChangeable, magnit, buttons
        } = externalRefs

        this.id = id
        this.label = label

        this.color = ref("white")
        this.selected = ref(false)

        this.relativePos = reactive({ ...relativePos })

        this.baseSize = ref(size)

        this.computedSize = computed(() => {
            const containerHalfWidth = width.value / 2
            const containerHalfHeight = height.value / 2

            const containerCenterOffsetX = centerChangeable.value.x
            const containerCenterOffsetY = -centerChangeable.value.y

            const elementCenterX = this.relativePos.x
            const elementCenterY = this.relativePos.y

            const defaultHalfSize = this.baseSize.value / 2

            const rightEdge = containerHalfWidth - containerCenterOffsetX
            const leftEdge = -containerHalfWidth - containerCenterOffsetX

            const topEdge = -containerHalfHeight - containerCenterOffsetY
            const bottomEdge = containerHalfHeight - containerCenterOffsetY

            const spaceToRight = Math.max(0, rightEdge - elementCenterX)
            const spaceToLeft = Math.max(0, elementCenterX - leftEdge)

            const spaceToTop = Math.max(0,  elementCenterY - topEdge)
            const spaceToBottom = Math.max(0, bottomEdge - elementCenterY)

            const verticalLimit = Math.min(spaceToTop, spaceToBottom)
            const horizontalLimit = Math.min(spaceToRight, spaceToLeft)

            const actualHalfSize = Math.min(defaultHalfSize, verticalLimit, horizontalLimit)

            return actualHalfSize * 2
        })

        this.isShowed = computed(() => {
            const containerHalfWidth = width.value / 2
            const containerHalfHeight = height.value / 2

            const containerCenterOffset = centerChangeable.value.x
            const containerCenterOffsetY = -centerChangeable.value.y

            const rightEdge = containerHalfWidth - containerCenterOffset
            const leftEdge = -containerHalfWidth - containerCenterOffset

            const topEdge = -containerHalfHeight - containerCenterOffsetY
            const bottomEdge = containerHalfHeight - containerCenterOffsetY

            const isFullyOutsideRight = (this.relativePos.x > rightEdge)
            const isFullyOutsideLeft = (this.relativePos.x  < leftEdge)

            const isFullyOutsideTop = (this.relativePos.y > bottomEdge)
            const isFullyOutsideBottom = (this.relativePos.y < topEdge)

            return !(isFullyOutsideLeft || isFullyOutsideRight || isFullyOutsideTop || isFullyOutsideBottom)
        })

        this.hovered = ref(false)

        this.position = computed(() => {
            return {
                x: center.value.x + this.relativePos.x,
                y: center.value.y - this.relativePos.y
            }
        })


        this.switchSelection = (bool) => {
            this.selected.value = bool
            this.color.value = this.selected.value ? "blue" : "white"
        }

        this.setPositionFromAbsolute = (x, y) => {
            // 1. Розрахунок бажаної позиції (поки без змін)
            let relX = - (center.value.x - x)
            let relY = center.value.y - y

            if (magnit.value > 0) {
                relX = Math.round(relX / magnit.value) * magnit.value
                relY = Math.round(relY / magnit.value) * magnit.value
            }

            const mySize = unref(this.baseSize) // unref гарантує, що ми отримаємо число
            const halfWidth = (width.value / 2 - mySize / 2)
            const halfHeight = (height.value / 2 - mySize / 2)

            // Обмеження стінами контейнера
            relX = Math.min(Math.max(relX, -halfWidth - centerChangeable.value.x), halfWidth - centerChangeable.value.x)
            relY = Math.min(Math.max(relY, -halfHeight + centerChangeable.value.y), halfHeight + centerChangeable.value.y)

            // 2. ПОКРАЩЕНА ЛОГІКА ЗІТКНЕНЬ (Ковзання)
            // Спочатку пробуємо застосувати нову координату X
            let newX = relX
            let newY = this.relativePos.y // Поки що Y старий

            if (!this.checkCollision(newX, newY, mySize)) {
                this.relativePos.x = newX
            }

            // Тепер пробуємо застосувати нову координату Y з (можливо) новим X
            newX = this.relativePos.x
            newY = relY

            if (!this.checkCollision(newX, newY, mySize)) {
                this.relativePos.y = newY
            }
        }

        // Допоміжний метод для перевірки зіткнень
        this.checkCollision = (candidateX, candidateY, mySize) => {
            for (const b of buttons.value) {
                if (b.id === this.id) continue

                // unref - це "магічна таблетка" від проблем з ref/proxy/value
                const otherSize = unref(b.baseSize)

                if (!otherSize) continue

                const distance = Math.hypot(b.relativePos.x - candidateX, b.relativePos.y - candidateY)
                const minDistance = (otherSize / 2 + mySize / 2)

                // Якщо відстань менша за суму радіусів - це зіткнення
                if (distance < minDistance - 0.1) { // -0.1 для уникнення дрожжання на межі
                    return true
                }
            }
            return false
        }

    // Старі методи видалені, оскільки вони тепер визначені в конструкторі
    // resizeButton() -> this.computedSize
    // switchSeletcion() -> this.switchSeletcion
    // get position() -> this.position
    // setPositionFromAbsolute() -> this.setPositionFromAbsolute
    }
}