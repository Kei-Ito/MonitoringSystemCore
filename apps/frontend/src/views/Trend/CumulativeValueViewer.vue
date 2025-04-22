<template>
    <div class="m-0 p-3">
        <div class="viewer">
            <div class="col">
                <div class="container WatMeter">
                    <div class="title WatMeter">
                        <i class="material-icons icon-style">bolt</i>
                        <span class="title-text">総消費電力</span>
                    </div>
                    <div class="content">
                        <div class="content-inner">
                            <p class="value">{{ round_value(props.value,1)}}</p>
                            <p class="unit">kWh</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="container CO2">
                    <div class="title CO2">
                        <i class="material-icons icon-style">cloud</i>
                        <span class="title-text px-2">CO2排出量</span>
                    </div>
                    <div class="content">
                        <div class="content-inner">
                            <p class="value">{{ round_value(calculateCO2(props.value),2) }}</p>
                            <p class="unit">kg-CO₂</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
});

function round_value(value: number,decimals:number): string {
    return value.toFixed(decimals);
}

function calculateCO2(value: number): number {
    return value * 0.434;
}

</script>

<style scoped>
.viewer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    gap: 10px; /* コンポーネント間のスペース */
    width:100%;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 0px;
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    background: #444c55;
    width: 100%;
}

/* containerとWatMeterクラスの両方を持つ場合 */
.container.WatMeter {
    border: 5px solid rgba(251, 240, 80, 0.7);
}

/* containerとCO2クラスの両方を持つ場合 */
.container.CO2 {
    border: 5px solid rgba(251, 80, 154, 0.7);
}

.title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.title.WatMeter {
    background: linear-gradient(87deg, rgba(235, 218, 0, 0.7) 0%, rgba(254, 202, 6, 0.7) 100%);
}

.title.CO2 {
    background: linear-gradient(87deg, rgba(251, 80, 154, 0.7) 0%, rgba(251, 80, 154, 0.7) 100%);
}

.content {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    margin: 0;
    border-radius: 0 0 10px 10px;
    background: #262626;
}

.content-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #fff;
    margin: 0;
}

.unit {
    font-size: 1.2rem;
    font-weight: normal;
    color: #ccc;
    margin: 0;
}

/* 画面サイズが1600px以下の場合 */
@media (max-width: 1600px) {
    .viewer {
        flex-direction: column; /* 縦並びに切り替え */
        align-items: center;
    }

}
@media (max-width: 768px) {
    .viewer {
        flex-direction: row; /* 横並びに切り替え */
        align-items: center;
    }
    .title.CO2 {
    font-size:1.1rem;
}
}
</style>
