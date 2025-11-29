<template>
    <div>
        <!-- 値の範囲 -->
        <div class="mb-3">
            <label class="form-label fw-bold">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">straighten</i>
                値の範囲
            </label>
            <div class="range-inputs">
                <div class="row g-2">
                    <div class="col-6">
                        <label class="form-label small">最小値</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="localOptions.minValue"
                            @change="emitUpdate"
                            placeholder="0"
                        />
                    </div>
                    <div class="col-6">
                        <label class="form-label small">最大値</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="localOptions.maxValue"
                            @change="emitUpdate"
                            placeholder="100"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 閾値と色設定 -->
        <div class="mb-3">
            <label class="form-label fw-bold">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">palette</i>
                閾値と色設定
            </label>
            <div class="threshold-colors">
                <div v-for="(_threshold, index) in localOptions.thresholds" :key="index" class="d-flex align-items-center mb-2">
                    <span class="threshold-label">範囲 {{ index + 1 }}</span>
                    <div class="d-flex align-items-center ms-auto">
                        <input
                            type="number"
                            class="form-control me-2"
                            v-model.number="localOptions.thresholds[index]"
                            @change="emitUpdate"
                            placeholder="閾値"
                            style="width: 100px;"
                        />
                        <input
                            type="color"
                            class="form-control form-control-color d-flex align-items-center"
                            v-model="localOptions.colors[index]"
                            @change="emitUpdate"
                            style="width: 50px; height: 38px; padding: 4px;"
                        />
                    </div>
                </div>
                <!-- 最後の範囲の色 -->
                <div class="d-flex align-items-center mb-2">
                    <span class="threshold-label">範囲 {{ localOptions.thresholds.length + 1 }}</span>
                    <div class="d-flex align-items-center ms-auto">
                        <span class="form-control text-muted me-2" style="width: 100px;">最大値まで</span>
                        <input
                            type="color"
                            class="form-control form-control-color d-flex align-items-center"
                            v-model="localOptions.colors[localOptions.thresholds.length]"
                            @change="emitUpdate"
                            style="width: 50px; height: 38px; padding: 4px;"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ChartOptions {
    minValue: number
    maxValue: number
    thresholds: number[]
    colors: string[]
}

const props = defineProps<{
    options: ChartOptions
}>()

const emit = defineEmits<{
    update: [options: ChartOptions]
}>()

const localOptions = ref<ChartOptions>(JSON.parse(JSON.stringify(props.options)))

// 初期化
watch(() => props.options, (newOptions) => {
    localOptions.value = JSON.parse(JSON.stringify(newOptions))
}, { immediate: true })

// 変更を親に通知
const emitUpdate = () => {
    emit('update', JSON.parse(JSON.stringify(localOptions.value)))
}
</script>

<style scoped>
.threshold-colors,
.range-inputs {
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.threshold-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #344767;
    margin-right: 1rem;
    min-width: 60px;
}

.form-control {
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
}

.form-label {
    margin-bottom: 0.5rem;
    color: #495057;
    font-weight: 500;
}

.form-label.small {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}
</style>
