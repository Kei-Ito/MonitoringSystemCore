<template>
    <div class="container">
        <div class="title bg-gradient-success">
            <i class="material-icons icon-style">
                brightness_high
            </i>
            <span class="title-text px-2">{{ props.title }}</span>
        </div>
        <div class="content">
            <span class="content-text font-weight-bold fs-3 px-2 p-0">{{props.value}}</span>
            <span class="content-text font-weight-bold fs-4 p-0 unit-label">Hr</span>
        </div>
    </div>
</template>
<script setup lang="ts">

const props = defineProps({
    value: {
        type: Number,
        default: 23
    },
    title: {
        type: String,
        required: true
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
    color: #fff;
    font-weight: bold;
    width: 100%;
    background: #444c55;
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
        font-size: 25px;
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
    background: #262626;

    .content-text {
        color: white;
        text-align: center;
        white-space: nowrap;
    }

    .unit-label {
        width: auto;
        min-width: 0;
        text-align: center;
    }
}
</style>