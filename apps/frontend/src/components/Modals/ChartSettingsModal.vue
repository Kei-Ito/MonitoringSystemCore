<template>
    <BaseModal :show="visible" title="グラフ設定" size="modal-xl" maxWidth="90%" @close="close">
        <!-- Body -->
        <div class="chart-settings-container">
            <div class="row g-4">
                <!-- 左側: プレビュー -->
                <div class="col-12 col-xl-7">
                    <div class="preview-section">
                        <h6 class="section-title mb-3">
                            <i class="material-icons align-middle me-2">visibility</i>
                            プレビュー
                        </h6>
                        <div class="preview-card">
                            <!-- グラフプレビュー（ChartHolderCardと同じ構造） -->
                            <div class="card z-index-2 mb-1 h-100 d-flex flex-column">
                                <!-- グラフ本体 -->
                                <div
                                    class="card-body flex-grow-1 p-2 border-radius-lg bg-gradient-dark shadow-dark m-2">
                                    <component v-if="chartComponent" :is="chartComponent" :chart="previewChart"
                                        :series="previewSeries" class="h-100 w-100 m-0" />
                                    <div v-else class="d-flex align-items-center justify-content-center h-100">
                                        <p class="text-white">プレビューを読み込み中...</p>
                                    </div>
                                </div>

                                <!-- タイトル & 単位 -->
                                <div class="title-unit-bar d-flex px-4">
                                    <!-- title -->
                                    <div class="scroll-box">
                                        <h5 class="scroll-text fs-4">
                                            {{ localSettings.chart_title || 'タイトル未設定' }}
                                        </h5>
                                    </div>

                                    <!-- unit -->
                                    <div class="scroll-box unit ms-auto">
                                        <h5 class="scroll-text fs-4 text-end">
                                            {{ localSettings.chart_unit || '単位未設定' }}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右側: 設定項目 -->
                <div class="col-12 col-xl-5">
                    <div class="settings-section">
                        <h6 class="section-title mb-3">
                            <i class="material-icons align-middle me-2">tune</i>
                            設定項目
                        </h6>

                        <div class="settings-form">
                            
                                <h6 class="subsection-title mb-3">
                                    <i class="material-icons align-middle me-2">palette</i>
                                    一般設定
                                </h6>
                            <div class="setting-card">
                                <!-- タイトル & 単位 -->
                                <div class="mb-3 ">
                                    <div class="row g-2">
                                        <!-- タイトル -->
                                        <div class="col-12 col-xl-6">
                                            <label class="form-label fw-bold">
                                                <i class="material-icons align-middle me-1"
                                                    style="font-size: 18px;">title</i>
                                                グラフタイトル
                                            </label>
                                            <input type="text" class="form-control" v-model.lazy="localSettings.chart_title"
                                                placeholder="グラフのタイトルを入力" />
                                        </div>

                                        <!-- 単位 -->
                                        <div class="col-12 col-xl-6">
                                            <label class="form-label fw-bold">
                                                <i class="material-icons align-middle me-1"
                                                    style="font-size: 18px;">straighten</i>
                                                単位
                                            </label>
                                            <input type="text" class="form-control" v-model.lazy="localSettings.chart_unit"
                                                placeholder="単位を入力（例: ℃, %, kW）" />
                                        </div>
                                    </div>
                                </div>

                                <!-- カテゴリ1 & カテゴリ2 -->
                                <div class="mb-3">
                                    <label class="form-label fw-bold">
                                        <i class="material-icons align-middle me-1"
                                            style="font-size: 18px;">category</i>
                                        カテゴリ
                                    </label>
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <label class="form-label small text-muted">照射炉</label>
                                            <select class="form-select" v-model="localSettings.category1">
                                                <option value="" disabled>照射炉を選択</option>
                                                <option v-for="cat in uiStore.category1List" :key="cat" :value="cat">
                                                    {{ cat }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small text-muted">分類</label>
                                            <select class="form-select" v-model="localSettings.category2">
                                                <option value="" disabled>分類を選択</option>
                                                <option v-for="cat in uiStore.category2List" :key="cat" :value="cat">
                                                    {{ cat }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 外観設定セクション -->
                            <div class="appearance-section mt-4 pt-3">
                                <h6 class="subsection-title mb-3">
                                    <i class="material-icons align-middle me-2">palette</i>
                                    外観設定
                                </h6>

                                <!-- ラインチャート / バーチャート用設定 -->
                                <LineBarChartSettings v-if="isLineOrBarChart" :options="localSettings.chart_options"
                                    :channels="chartChannels" @update="updateChartOptions" />

                                <!-- ゲージチャート / 横バーチャート用設定 -->
                                <GaugeHorizontalBarSettings v-if="isGaugeOrHorizontalBar"
                                    :options="localSettings.chart_options" @update="updateChartOptions" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <template #footer>
            <button type="button" class="btn btn-primary" style="min-width: 120px;" @click="save">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">save</i>
                更新
            </button>
            <button type="button" class="btn btn-secondary" style="min-width: 120px;" @click="close">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">close</i>
                キャンセル
            </button>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ChartConfig } from '@monitoring/shared/model'

import BaseModal from '@/components/BaseModal.vue'
import BarChart from '@/components/Charts/BarChart.vue'
import GaugeChart from '@/components/Charts/GaugeChart.vue'
import HorizontalBarChart from '@/components/Charts/HorizontalBarChart.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import LineBarChartSettings from '@/components/Modals/ChartSettings/LineBarChartSettings.vue'
import GaugeHorizontalBarSettings from '@/components/Modals/ChartSettings/GaugeHorizontalBarSettings.vue'
import { useSeries } from '@/pinia/useSeries'
import { useMonitoringStore } from '@/pinia/monitoringStore'
import { useUiStore } from '@/pinia/uiStore'

const props = defineProps<{
    visible: boolean
    chart: ChartConfig
}>()

const emit = defineEmits<{
    close: []
    update: [config: ChartConfig]
}>()

// ローカル設定（編集用）
const localSettings = ref<ChartConfig>(JSON.parse(JSON.stringify(props.chart)))

// プレビュー用のチャート設定
const previewChart = computed(() => ({ ...localSettings.value }))
const previewSeries = useSeries(props.chart.chart_uuid)

// チャートコンポーネントのマッピング
const componentMap = {
    HorizontalBarChart,
    GaugeChart,
    LineChart,
    BarChart
}
const chartComponent = computed(() => componentMap[localSettings.value.chart_type])

// グラフタイプによる条件分岐
const isLineOrBarChart = computed(() =>
    localSettings.value.chart_type === 'LineChart' || localSettings.value.chart_type === 'BarChart'
)
const isGaugeOrHorizontalBar = computed(() =>
    localSettings.value.chart_type === 'GaugeChart' || localSettings.value.chart_type === 'HorizontalBarChart'
)

// チャンネル情報を取得
const monitoringStore = useMonitoringStore()
const uiStore = useUiStore()
const chartChannels = computed(() => {
    if (!props.chart.channel_uuids || props.chart.channel_uuids.length === 0) return []

    return props.chart.channel_uuids.map(uuid => {
        for (const module of monitoringStore.ioModules) {
            const channel = module.input_channels.find(ch => ch.channel_uuid === uuid)
            if (channel) return channel
        }
        return null
    }).filter(ch => ch !== null)
})

// チャートオプションの更新
const updateChartOptions = (options: any) => {
    localSettings.value.chart_options = options
}

// モーダルが開いたときに設定をリセット
watch(() => props.visible, (newVal) => {
    if (newVal) {
        localSettings.value = JSON.parse(JSON.stringify(props.chart))

        // chart_optionsの初期化
        if (!localSettings.value.chart_options) {
            localSettings.value.chart_options = {}
        }

        // ラインチャート/バーチャート用の初期化
        if (isLineOrBarChart.value) {
            if (!localSettings.value.chart_options.thresholds) {
                localSettings.value.chart_options.thresholds = { min: null, max: null, color: '#ff0000' }
            }
            if (!localSettings.value.chart_options.visibility) {
                localSettings.value.chart_options.visibility = { minY: null, maxY: null }
            }
            if (!localSettings.value.chart_options.seriesColors) {
                localSettings.value.chart_options.seriesColors = {}
            }
        }

        // ゲージ/横バーチャート用の初期化
        if (isGaugeOrHorizontalBar.value) {
            if (!localSettings.value.chart_options.minValue) {
                localSettings.value.chart_options.minValue = 0
            }
            if (!localSettings.value.chart_options.maxValue) {
                localSettings.value.chart_options.maxValue = 100
            }
            if (!localSettings.value.chart_options.thresholds) {
                localSettings.value.chart_options.thresholds = [33, 66]
            }
            if (!localSettings.value.chart_options.colors) {
                localSettings.value.chart_options.colors = ['#00ff00', '#ffff00', '#ff0000']
            }
        }
    }
})

const close = () => {
    emit('close')
}

const save = () => {
    emit('update', localSettings.value)
    close()
}
</script>

<style scoped>
.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #5e72e4;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0.5rem;
    flex-shrink: 0;
}

.subsection-title {
    font-size: 1rem;
    font-weight: 600;
    color: #5e72e4;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.4rem;
}

.appearance-section {
    border-top: 2px solid #dee2e6;
}

.preview-section {
    display: flex;
    flex-direction: column;
}

.preview-card {
    display: flex;
    flex-direction: column;
}

.preview-card .card {
    height: 100%;
}

.settings-section {
    background: #f8f9fa;
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}

.setting-card {
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-form {
    overflow-y: auto;
    padding-right: 0.5rem;
}

/* カスタムスクロールバー */
.settings-form::-webkit-scrollbar {
    width: 6px;
}

.settings-form::-webkit-scrollbar-track {
    background: #e9ecef;
    border-radius: 10px;
}

.settings-form::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
}

.settings-form::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
}

/* ChartHolderCardのスタイルを再利用 */
.scroll-box {
    position: relative;
    overflow: hidden;
    flex: 1 1 auto;
    max-width: 100%;
    height: 40px;
}

.scroll-text {
    position: absolute;
    white-space: nowrap;
    inset-inline-start: 0;
    transform: translateX(0);
}

.unit .scroll-text {
    inset-inline-start: auto;
    inset-inline-end: 0;
    text-align: end;
}

.form-label {
    margin-bottom: 0.5rem;
    color: #344767;
}

.form-control,
.form-select {
    border-radius: 0.5rem;
    border: 1px solid #d2d6da;
    padding: 0.5rem 0.75rem;
}

.form-control:focus,
.form-select:focus {
    border-color: #5e72e4;
    box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25);
}

/* デスクトップ表示（XL以上）でのレイアウト調整 */
@media (min-width: 1200px) {
    .chart-settings-container {
        height: 55vh;
        min-height: 400px;
        max-height: 600px;
    }

    .chart-settings-container .row {
        height: 100%;
    }

    .chart-settings-container .col-xl-7,
    .chart-settings-container .col-xl-5 {
        height: 100%;
    }

    .preview-section {
        height: 100%;
    }

    .preview-card {
        height: auto;
        flex: 1;
    }

    .settings-section {
        height: 100%;
        max-height: 100%;
    }

    .settings-form {
        flex: 1;
        min-height: 0;
        /* Flexboxスクロール用 */
        max-height: none;
    }
}

/* モバイル・タブレット表示（XL未満） */
@media (max-width: 1199px) {
    .preview-card {
        height: 400px;
    }

    .settings-form {
        max-height: 500px;
        /* モバイル時は適度な高さ制限 */
    }
}
</style>
