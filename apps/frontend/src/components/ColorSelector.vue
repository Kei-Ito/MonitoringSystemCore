<template>
  <div class="color-selector">
    <span
        v-for="color in colors"
        :key="color.code"
        :class="['badge', 'filter', `bg-gradient-${color.code}`]"
        :data-color="color.code"
        @click="changeColor(color.code)"
        style="cursor: pointer; margin: 0 5px; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"
      ></span>
  </div>
</template>

<script>
import { defineComponent,ref } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'ColorSelector',
  setup() {
    const colors = [
    { code: 'info', label: 'Blue' },
    { code: 'success', label: 'Green' },
      { code: 'primary', label: 'Pink' },
      { code: 'dark', label: 'Black' },
      { code: 'warning', label: 'Orange' },
      { code: 'danger', label: 'Red' }
    ]

    const selectedColor = ref(colors[0].code)

    return {
      colors,
      selectedColor,
    }
  },
  methods: {
    changeColor(color) {
      this.setColor(color);
    },
    ...mapActions(["setColor"]),
  }
});
</script>