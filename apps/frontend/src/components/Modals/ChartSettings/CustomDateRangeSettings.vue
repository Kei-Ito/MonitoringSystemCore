<template>
    <div class="custom-date-range-settings">
        <!-- 個別区間設定の有効/無効 -->
        <div class="d-flex align-items-center mb-3">
            <label class="form-label fw-bold mb-0">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">date_range</i>
                個別の表示区間
            </label>
            <div class="form-check form-switch ms-auto mb-0">
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="localOptions.useCustomDateRange"
                    @change="emitUpdate"
                    style="cursor: pointer;"
                />
            </div>
        </div>

        <div v-if="localOptions.useCustomDateRange" class="custom-date-range-content mt-2">
            <p class="text-muted small mb-3">
                このグラフに独自の表示期間を設定します。全体設定より優先されます。
            </p>

            <!-- プリセットモード選択 -->
            <div class="mb-3">
                <label class="form-label small">表示モード</label>
                <div class="d-flex flex-wrap gap-2">
                    <button 
                        v-for="preset in presetOptions" 
                        :key="preset.value"
                        type="button" 
                        class="btn btn-sm preset-btn"
                        :class="localOptions.customPresetMode === preset.value ? 'btn-primary' : 'btn-outline-secondary'"
                        @click="selectPresetMode(preset.value)"
                    >
                        {{ preset.label }}
                    </button>
                </div>
            </div>

            <!-- カスタム期間入力（カスタムモードの場合のみ表示） -->
            <div v-if="localOptions.customPresetMode === TrendPresetMode.Custom" class="custom-range-inputs">
                <div class="row g-2">
                    <div class="col-6">
                        <label class="form-label small">開始日</label>
                        <input 
                            type="date" 
                            class="form-control" 
                            v-model="customStartDateStr"
                            :max="customEndDateStr"
                            @change="onDateChange"
                        />
                    </div>
                    <div class="col-6">
                        <label class="form-label small">終了日</label>
                        <input 
                            type="date" 
                            class="form-control" 
                            v-model="customEndDateStr"
                            :min="customStartDateStr"
                            @change="onDateChange"
                        />
                    </div>
                </div>
                <!-- クイック選択 -->
                <div class="mt-2">
                    <label class="form-label small text-muted">クイック選択</label>
                    <div class="btn-group w-100" role="group">
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="setYesterday">
                            昨日
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="setLastWeek">
                            過去7日
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="setLastMonth">
                            過去30日
                        </button>
                    </div>
                </div>
            </div>

            <!-- プリセットモードの説明表示 -->
            <div v-else class="preset-description mt-2 p-2 bg-light rounded">
                <small class="text-muted">
                    <i class="material-icons align-middle me-1" style="font-size: 14px;">info</i>
                    {{ presetDescription }}
                </small>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { TrendPresetMode } from '@monitoring/shared/enum';

const props = defineProps<{
    options: {
        useCustomDateRange?: boolean;
        customPresetMode?: TrendPresetMode;
        customStartDate?: string;
        customEndDate?: string;
    };
}>();

const emit = defineEmits<{
    update: [options: typeof props.options];
}>();

// プリセット選択肢
const presetOptions = [
    { value: TrendPresetMode.Realtime, label: 'リアルタイム' },
    { value: TrendPresetMode.LastWeek, label: '直近1週間' },
    { value: TrendPresetMode.LastMonth, label: '直近1ヶ月' },
    { value: TrendPresetMode.Custom, label: 'カスタム' },
];

// ローカル状態
const localOptions = ref({
    useCustomDateRange: props.options.useCustomDateRange ?? false,
    customPresetMode: props.options.customPresetMode ?? TrendPresetMode.Realtime,
    customStartDate: props.options.customStartDate,
    customEndDate: props.options.customEndDate,
});

// 日付文字列の管理
const toDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const now = new Date();
const customStartDateStr = ref(
    localOptions.value.customStartDate 
        ? localOptions.value.customStartDate.split('T')[0] 
        : toDateString(now)
);
const customEndDateStr = ref(
    localOptions.value.customEndDate 
        ? localOptions.value.customEndDate.split('T')[0] 
        : toDateString(now)
);

// プリセットモードの説明
const presetDescription = computed(() => {
    switch (localOptions.value.customPresetMode) {
        case TrendPresetMode.Realtime:
            return '当日のデータをリアルタイムに表示します。日付が変わると自動で更新されます。';
        case TrendPresetMode.LastWeek:
            return '直近7日間のデータを表示します。日付が変わると自動で更新されます。';
        case TrendPresetMode.LastMonth:
            return '直近30日間のデータを表示します。日付が変わると自動で更新されます。';
        default:
            return '';
    }
});

// propsの変更を監視
watch(() => props.options, (newOptions) => {
    localOptions.value = {
        useCustomDateRange: newOptions.useCustomDateRange ?? false,
        customPresetMode: newOptions.customPresetMode ?? TrendPresetMode.Realtime,
        customStartDate: newOptions.customStartDate,
        customEndDate: newOptions.customEndDate,
    };
    if (newOptions.customStartDate) {
        customStartDateStr.value = newOptions.customStartDate.split('T')[0];
    }
    if (newOptions.customEndDate) {
        customEndDateStr.value = newOptions.customEndDate.split('T')[0];
    }
}, { deep: true });

const selectPresetMode = (mode: TrendPresetMode) => {
    localOptions.value.customPresetMode = mode;
    emitUpdate();
};

const onDateChange = () => {
    localOptions.value.customStartDate = customStartDateStr.value;
    localOptions.value.customEndDate = customEndDateStr.value;
    emitUpdate();
};

const emitUpdate = () => {
    emit('update', { ...localOptions.value });
};

// クイック選択機能
const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    customStartDateStr.value = toDateString(yesterday);
    customEndDateStr.value = toDateString(yesterday);
    onDateChange();
};

const setLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    customStartDateStr.value = toDateString(start);
    customEndDateStr.value = toDateString(end);
    onDateChange();
};

const setLastMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    customStartDateStr.value = toDateString(start);
    customEndDateStr.value = toDateString(end);
    onDateChange();
};
</script>

<style scoped>
.custom-date-range-settings {
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.preset-btn {
    min-width: 80px;
}

.preset-description {
    border-left: 3px solid #5e72e4;
}

.custom-range-inputs {
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
}
</style>
