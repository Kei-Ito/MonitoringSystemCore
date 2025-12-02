<template>
    <div>
        <!-- Y軸範囲設定 -->
        <div class="mb-3">
            <div class="d-flex align-items-center mb-2">
                <label class="form-label fw-bold mb-0">
                    <i class="material-icons align-middle me-1" style="font-size: 18px;">height</i>
                    Y軸範囲
                </label>
                <div class="form-check form-switch ms-auto mb-0">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="yAxisRangeEnabled"
                        @change="onYAxisRangeEnabledChange"
                        style="cursor: pointer;"
                    />
                </div>
            </div>

            <div v-if="yAxisRangeEnabled" class="range-inputs mt-2">
                <div class="row g-2">
                    <div class="col-6">
                        <label class="form-label small">最小値</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="localOptions.visibility.minY"
                            @change="emitUpdate"
                            placeholder="自動"
                        />
                    </div>
                    <div class="col-6">
                        <label class="form-label small">最大値</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="localOptions.visibility.maxY"
                            @change="emitUpdate"
                            placeholder="自動"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- チャンネルの色と線の太さ設定 -->
        <div class="mb-3">
            <label class="form-label fw-bold">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">palette</i>
                チャンネルの外観
            </label>
            <div class="channel-colors">
                <div v-for="channel in channels" :key="channel.channel_uuid" class="d-flex align-items-center mb-2">
                    <span class="channel-name flex-grow-1">{{ channel.channel_name }}</span>
                    <input
                        type="color"
                        class="form-control form-control-color me-2 d-flex align-items-center"
                        v-model="channelColors[channel.channel_uuid]"
                        @change="emitUpdate"
                        style="width: 50px; height: 38px; padding: 4px;"
                    />
                    <input
                        type="number"
                        class="form-control text-center"
                        v-model.number="channelLineWidths[channel.channel_uuid]"
                        @change="emitUpdate"
                        min="1"
                        max="5"
                        step="0.5"
                        style="width: 70px;"
                    />
                    <span class="ms-2 text-muted small">px</span>
                </div>
            </div>
        </div>

        <!-- 閾値設定 -->
        <div class="mb-3">
            <div class="d-flex align-items-center mb-2">
                <label class="form-label fw-bold mb-0">
                    <i class="material-icons align-middle me-1" style="font-size: 18px;">notifications</i>
                    閾値設定
                </label>
                <div class="form-check form-switch ms-auto mb-0">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="thresholdsEnabled"
                        @change="onThresholdsEnabledChange"
                        style="cursor: pointer;"
                    />
                </div>
            </div>

            <div v-if="thresholdsEnabled" class="threshold-inputs mt-2">
                <div class="row g-2 mb-2">
                    <div class="col-6">
                        <label class="form-label small">最小閾値</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="localOptions.thresholds.min"
                            @change="emitUpdate"
                            placeholder="下限値"
                        />
                    </div>
                    <div class="col-6">
                        <label class="form-label small">最大閾値</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model.number="localOptions.thresholds.max"
                            @change="emitUpdate"
                            placeholder="上限値"
                        />
                    </div>
                </div>
                <div class="mb-2">
                    <label class="form-label small">閾値超過時の色</label>
                    <div class="d-flex align-items-center">
                        <input
                            type="color"
                            class="form-control form-control-color d-flex align-items-center"
                            v-model="localOptions.thresholds.color"
                            @change="emitUpdate"
                            style="width: 60px; height: 38px; padding: 4px;"
                        />
                        <input
                            type="text"
                            class="form-control ms-2"
                            v-model="localOptions.thresholds.color"
                            @change="emitUpdate"
                            placeholder="#ff0000"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 積算表示設定 -->
        <div class="mb-3">
            <div class="d-flex align-items-center mb-2">
                <label class="form-label fw-bold mb-0">
                    <i class="material-icons align-middle me-1" style="font-size: 18px;">functions</i>
                    積算表示
                </label>
                <div class="form-check form-switch ms-auto mb-0">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="localOptions.isCumulative"
                        @change="emitUpdate"
                        style="cursor: pointer;"
                    />
                </div>
            </div>

            <div v-if="localOptions.isCumulative" class="cumulative-inputs mt-2">
                <div class="mb-2">
                    <label class="form-label small">集計間隔（分）</label>
                    <input
                        type="number"
                        class="form-control"
                        v-model.number="localOptions.cumulativeIntervalMinutes"
                        @change="emitUpdate"
                        min="1"
                        placeholder="60"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Channel {
    channel_uuid: string
    channel_name: string
}

interface ChartOptions {
    thresholds: {
        min: number | null
        max: number | null
        color: string
    }
    visibility: {
        minY: number | null
        maxY: number | null
    }
    seriesColors?: Record<string, string>
    seriesLineWidths?: Record<string, number>
    isCumulative?: boolean
    cumulativeIntervalMinutes?: number
}

const props = defineProps<{
    options: ChartOptions
    channels: Channel[]
}>()

const emit = defineEmits<{
    update: [options: ChartOptions]
}>()

const localOptions = ref<ChartOptions>(JSON.parse(JSON.stringify(props.options)))
const thresholdsEnabled = ref(false)
const yAxisRangeEnabled = ref(false)
const channelColors = ref<Record<string, string>>({})
const channelLineWidths = ref<Record<string, number>>({})

// デフォルトカラーパレット
const defaultColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
]

// 初期化
watch(() => props.options, (newOptions) => {
    localOptions.value = JSON.parse(JSON.stringify(newOptions))
    
    // 閾値の有効/無効を判定（どちらか一方でも値があれば有効）
    thresholdsEnabled.value = newOptions.thresholds?.min != null || newOptions.thresholds?.max != null
    
    // Y軸範囲の有効/無効を判定
    yAxisRangeEnabled.value = newOptions.visibility?.minY != null || newOptions.visibility?.maxY != null
    
    // チャンネルカラーと線の太さの初期化
    props.channels.forEach((channel, index) => {
        // カラーの初期化
        if (newOptions.seriesColors && newOptions.seriesColors[channel.channel_uuid]) {
            channelColors.value[channel.channel_uuid] = newOptions.seriesColors[channel.channel_uuid]
        } else {
            channelColors.value[channel.channel_uuid] = defaultColors[index % defaultColors.length]
        }
        
        // 線の太さの初期化
        if (newOptions.seriesLineWidths && newOptions.seriesLineWidths[channel.channel_uuid]) {
            channelLineWidths.value[channel.channel_uuid] = newOptions.seriesLineWidths[channel.channel_uuid]
        } else {
            channelLineWidths.value[channel.channel_uuid] = 2 // デフォルトは2px
        }
    })
}, { immediate: true })

/**
 * 値を数値またはnullに変換する
 * 空文字列、NaN、undefinedの場合はnullを返す
 */
const toNumberOrNull = (value: unknown): number | null => {
    if (value === '' || value === null || value === undefined) {
        return null
    }
    const num = Number(value)
    return isNaN(num) ? null : num
}

// 変更を親に通知
const emitUpdate = () => {
    const updated = JSON.parse(JSON.stringify(localOptions.value))
    
    // チャンネルカラーを反映
    updated.seriesColors = { ...channelColors.value }
    
    // 線の太さを反映
    updated.seriesLineWidths = { ...channelLineWidths.value }
    
    // 閾値が無効の場合はnullに
    if (!thresholdsEnabled.value) {
        updated.thresholds = { min: null, max: null, color: '#ff0000' }
    } else {
        // 閾値の値を数値またはnullに変換
        updated.thresholds.min = toNumberOrNull(updated.thresholds.min)
        updated.thresholds.max = toNumberOrNull(updated.thresholds.max)
    }
    
    // Y軸範囲が無効の場合はnullに
    if (!yAxisRangeEnabled.value) {
        updated.visibility = { minY: null, maxY: null }
    } else {
        // Y軸範囲の値を数値またはnullに変換
        updated.visibility.minY = toNumberOrNull(updated.visibility.minY)
        updated.visibility.maxY = toNumberOrNull(updated.visibility.maxY)
    }
    
    emit('update', updated)
}

const onThresholdsEnabledChange = () => {
    if (thresholdsEnabled.value) {
        // 有効化されたとき、値がなければ初期値をセット
        if (localOptions.value.thresholds.min == null) localOptions.value.thresholds.min = 0
        if (localOptions.value.thresholds.max == null) localOptions.value.thresholds.max = 100
    }
    emitUpdate()
}

const onYAxisRangeEnabledChange = () => {
    if (yAxisRangeEnabled.value) {
        // 有効化されたとき、値がなければ初期値をセット
        if (localOptions.value.visibility.minY == null && localOptions.value.visibility.maxY == null) {
             localOptions.value.visibility.minY = 0
             localOptions.value.visibility.maxY = 100
        }
    }
    emitUpdate()
}
</script>

<style scoped>
.channel-colors,
.threshold-inputs,
.range-inputs,
.cumulative-inputs {
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.channel-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #344767;
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
