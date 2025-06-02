<template>
    <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.spinner {
    margin: 100px auto 0;
    width: 150px;
    text-align: center;
}

.spinner>div {
    width: 36px;
    height: 36px;
    background-color: white;

    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
    animation-delay: -0.32s;
}

.spinner .bounce2 {
    animation-delay: -0.16s;
}


@keyframes sk-bouncedelay {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1.0);
    }
}
</style>
