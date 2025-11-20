<template>
    <div class="container">
        <div class="title" :class="color">
            <i class="material-icons icon-style">
                {{ icon }}
            </i>
            <span class="title-text px-2">{{ props.title }}</span>
        </div>
        <div class="content bg-gradient-dark shadow-dark ">
            <span class="content-text font-weight-bold fs-3 px-2 p-0">{{ props.value }}</span>
            <span class="content-text font-weight-bold fs-4 p-0 unit-label">Hr</span>
        </div>
    </div>
</template>
<script setup lang="ts">

import { computed, type ComputedRef } from 'vue';
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum'

const warningThreshold: number = 700;
const moderateThreshold: number = 500;

const props = defineProps({
    value: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
});

/**
 * タイトル部に表示するアイコン
 * 
 * 照射炉の稼働時間に応じてアイコンを動的に設定
 * - 警告閾値以上: 警告アイコン
 * - 中程度閾値以上: 低輝度アイコン
 * - それ以下: 高輝度アイコン
 */
const icon: ComputedRef<string> = computed(() => {
    if (props.value > warningThreshold) {
        return 'warning_amber';
    } else if (props.value > moderateThreshold) {
        return 'brightness_low';
    }
    else {
        return 'brightness_high';
    }
});

/**
 * タイトルの背景色を決定する
 * 
 * 照射炉の稼働状態と稼働時間に応じて背景色を動的に設定
 * - 稼働中: 稼働時間の閾値に応じて警告色(warning)、情報色(info)、成功色(success)を使い分け
 * - 停止中: グレー表示
 */
const color: ComputedRef<string> = computed(() => {
    // 照射炉が稼働中の場合はタイトルに色を付ける
    if (props.status === DeviceHealthEnum.Good ||
        props.status === DeviceHealthEnum.Caution ||
        props.status === DeviceHealthEnum.Error) {
        if (props.value > warningThreshold) {
            return 'bg-warning';
        } else if (props.value > moderateThreshold) {
            return 'bg-gradient-info';
        }
        else {
            return 'bg-gradient-success';
        }
    }
    // そうでなければグレー表示
    else{
        return 'bg-gradient-secondary';
    }

});

</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 0px;
    margin: 0px;
    font-weight: bold;
    width: 100%;
}

.title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 0px 0px 0px;
    font-size: 1.3rem;
    font-weight: bold;
    border-radius: 10px 10px 0px 0px;

    .title-text {
        color: #fff;
    }

    .icon-style {
        font-size: 22px;
        color: #fff;
    }
}

.content {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.4rem;
    padding: 3px;
    border-radius: 0px 0px 10px 10px;

    .content-text {
        color: #fdfdfd;
        text-align: center;
        white-space: nowrap;
    }

    .unit-label {
        width: auto;
        min-width: 0;
        text-align: center;
    }
}

.bg-warning {
    background-color: #db6027 !important;
    /* Bootstrapの濃い系トーン */
    color: #fff !important;
}
</style>