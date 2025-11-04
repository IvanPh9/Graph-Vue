<script setup>
import { ref } from "vue"

const margin = 10
const width = 1300
const height = 700
const Magnit = ref(5)

function increaseMagnit() {
  Magnit.value += 5
}

function decreaseMagnit() {
  Magnit.value = Math.max(5, Magnit.value - 5) // мінімум 5
}

// Центр контейнера
const center = { x:width / 2, y: height / 2 }

// Реактивний масив кнопок
const buttons = ref([])
const lines = ref([])

// Клас кнопки з координатами відносно центру
class Button {
  constructor(id, label, size, relativePos) {
    this.id = id
    this.label = label
    this.size = size;
    this.color = "white"
    this.relativePos = { ...relativePos } // координати від центру
    this.hover = false;
    this.selected = false;
  }

  switchSeletcion(bool) {
    this.selected = bool
    if (this.selected) {
      this.color = "blue"
    } else {
      this.color = "white"
    }
  }

  // Абсолютні координати для DOM
  get position() {
    return {
      x: center.x + this.relativePos.x,
      y: center.y - this.relativePos.y
    }
  }

  // Встановити нову позицію у відносній системі
  setPositionFromAbsolute(x, y) {
    // Перетворюємо на координати від центру
    let relX = - (center.x - x)
    let relY = center.y - y

    relX = Math.round(relX / Magnit.value) * Magnit.value
    relY = Math.round(relY / Magnit.value) * Magnit.value

    // Обмеження по контейнеру
    const halfWidth = (width) / 2 - this.size/2
    const halfHeight = (height) / 2 - this.size/2

    relX = Math.min(Math.max(relX, -halfWidth), halfWidth)
    relY = Math.min(Math.max(relY, -halfHeight), halfHeight)

    for (const b of buttons.value) {
      let disttance = Math.sqrt(Math.pow(b.relativePos.x - relX, 2) + Math.pow(b.relativePos.y - relY, 2))
      if (b.id !== this.id && disttance < (b.size/2 + this.size/2)) {
        return
      }
    }

    this.relativePos.x = relX
    this.relativePos.y = relY
  }
}

class Line {
  constructor(fromButton, toButton, color = "gray", width = 2) {
    this.fromButton = fromButton
    this.toButton = toButton
    this.color = color
    this.width = width
  }
}

// Додаємо кнопку
buttons.value.push(new Button(1, "A", 50, { x: 100, y: 100 }))
buttons.value.push(new Button(2, "B",50,  { x: 10, y: 10 }))
buttons.value.push(new Button(3, "C",50,  { x: -100, y: -100 }))

let draggingButton = null
let offsetX = 0
let offsetY = 0
let preventClick = false // <-- ключовий флаг

function startMoving(event, button) {
  const selectedButtons = buttons.value.filter(b => b.selected)
  if (selectedButtons.length > 0) {
    return
  }
  draggingButton = button
  preventClick = false
  const pos = button.position
  offsetX = event.clientX - pos.x
  offsetY = event.clientY - pos.y

  window.addEventListener("mousemove", onMouseMove)
  window.addEventListener("mouseup", stopMoving)
}

function onMouseMove(event) {
  if (!draggingButton) return
  preventClick = true // був рух — не виконувати click
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

function handleButtonClick(event, button) {
  if (preventClick) return // якщо був drag — ігноруємо click
  clickButtonToDrawLine(button)
}

// Ссилка на SVG
const svgRef = ref(null)
const previewLine = ref(null) // {fromButton, x, y} або null

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

function onMouseMovePreview(event) {
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

window.addEventListener("mousemove", onMouseMovePreview)

function handleKeyPress(event) {
  if (event.key === "Escape") {
    for(const b of buttons.value) {
      if (b.selected) b.switchSeletcion(false)
    }
    previewLine.value = null
  }
}

window.addEventListener("keydown", handleKeyPress)

</script>

<template>
  <div id="app" >
    <div class="flex">
      <div
          class="border-b-gray-600 border-1 rounded-3xl relative flex-initial "
          :style="{ width: width + 'px', height: height + 'px', margin: margin + 'px' }"
      >
        <svg ref="svgRef" :width="width" :height="height">
          <polyline
              v-for="(line, i) in lines"
              :key="i"
              :points="`${line.fromButton.position.x},${line.fromButton.position.y} ${line.toButton.position.x},${line.toButton.position.y}`"
              :stroke="line.color"
              :stroke-width="line.width"
              fill="none"
          />
          <!-- Фантомна лінія -->
          <line
              v-if="previewLine"
              :x1="previewLine.fromButton.position.x"
              :y1="previewLine.fromButton.position.y"
              :x2="previewLine.x"
              :y2="previewLine.y"
              stroke="blue"
              stroke-width="1"
              stroke-dasharray="5,5"
          />
        </svg>

        <button
            class="absolute"
            :style="{ left: center.x + 'px', top: center.y + 'px', transform: 'translate(-50%, -50%)' }"
        ></button>
        <!-- Кнопки -->
        <div v-for="b in buttons" :key="b.id">
          <button
              @mousedown="e => startMoving(e, b)"
              @click="e => handleButtonClick(e, b)"
              class=" rounded-full border-3 border-b-gray-900"
              :style="{ position: 'absolute', left: b.position.x + 'px', top: b.position.y + 'px', transform: 'translate(-50%, -50%)',
             width: b.size + 'px', height: b.size + 'px', backgroundColor: b.color }"
          >
          </button>
        </div>
      </div>
      <div class="flex-initial">
        <div>
          <table class="table-auto border-collapse border border-slate-400 mt-5">
            <thead>
            <tr>
              <th class="border border-slate-300 px-4 py-2">ID</th>
              <th class="border border-slate-300 px-4 py-2">Label</th>
              <th class="border border-slate-300 px-4 py-2">Rel X</th>
              <th class="border border-slate-300 px-4 py-2">Rel Y</th>
              <th class="border border-slate-300 px-4 py-2">Select</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="b in buttons" :key="b.id">
              <td class="border border-slate-300 px-4 py-2">{{ b.id }}</td>
              <td class="border border-slate-300 px-4 py-2">{{ b.label }}</td>
              <td class="border border-slate-300 px-4 py-2">{{ b.relativePos.x }}</td>
              <td class="border border-slate-300 px-4 py-2">{{ b.relativePos.y }}</td>
              <td class="border border-slate-300 px-4 py-2">{{ b.selected }}</td>
            </tr>
            </tbody>
          </table>
          <br>
          <table>
            <thead>
            <tr>
              <th class="border border-slate-300 px-4 py-2">From</th>
              <th class="border border-slate-300 px-4 py-2">To</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(line, index) in lines" :key="index">
              <td class="border border-slate-300 px-4 py-2">{{ line.fromButton.label }}</td>
              <td class="border border-slate-300 px-4 py-2">{{ line.toButton.label }}</td>
            </tr>
            </tbody>
          </table>
          {{preventClick}}
        </div>
        <div>
          <p class="mt-5">Магніт: {{ Magnit }} px</p>
          <button @click="increaseMagnit" class="px-1 py-2 bg-amber-300">+5 px</button>
          <button @click="decreaseMagnit" class="px-1 py-2 bg-amber-400">-5 px</button>
        </div>
      </div>
    </div>
  </div>
</template>
