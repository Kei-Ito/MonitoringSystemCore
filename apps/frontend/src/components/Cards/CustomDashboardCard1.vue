<template>
    <div class="card z-index-2 mb-1 mt-0 mx-0 px-0 bg-gradient-dark shadow-dark"  style="height:80vh">
        <div class="card-header z-index-2 bg-transparent">
            <label class="text-white fs-4">流水殺菌装置</label>
        </div>
        <div class="card-body">
            <div class="row border border-radius-lg border-2 border-secondary">
                <div class="col-3">
                    <div class="row">
                        <div class="col-12">
                            <label >{{ props.chartValue0 }}</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <label >{{ props.chartValue1 }}</label>
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="row">
                        <div class="col-12">
                            <label >{{ props.chartValue2 }}</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <label >{{ props.chartValue3 }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';


const props = defineProps({
    chartValue0: {
        type: Number,
        required: true
    },
    chartValue1: {
        type: Number,
        required: true
    },
    chartValue2: {
        type: Number,
        required: true
    },
    chartValue3: {
        type: Number,
        required: true
    },
    
});




onMounted(() => {
    console.log('mounted');
})


</script>

<style scoped>
.row-flex-div {
    display: flex;
    justify-content: space-between;
}
</style>