<template>
  <div class="py-4 container-fluid">
    
    <div class="row mb-4">
      
      <div class="row">
        <trend-nav-bar-card />
        <div class="col-lg-12 col-md-12 mx-0 p-0">
          <trend-line-chart-holder-card color="dark">
            <echarts-line-chart :selectedDate="selectedDate" />

          </trend-line-chart-holder-card>
        </div>
      </div>
      <div class="col-lg-12 position-relative z-index-2">

        <div class="row mt-4 justify-content-center align-items-center">
          <div class="col-lg-12 col-md-12 mt-4" style="width:600px">
            <CumulativeValueCard />
          </div>
        </div>
      </div>
    </div>
    <date-picker-modal :show="isModalVisible" @close="hideModal" @date-selected="updateDate" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import TrendLineChartHolderCard from "./Trend/TrendLineChartHolderCard.vue";
import DatePickerModal from "../components/DatePickerModal.vue";
import EchartsLineChart from "@/components/Charts/TrendLineChart.vue";
import TrendNavBarCard from "@/components/Cards/TrendNavBarCard.vue";
import CumulativeValueCard  from "./Trend/CumulativeValueCard.vue";

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const nextDay = new Date(today);
nextDay.setDate(nextDay.getDate() + 1);

const isModalVisible = ref(false);
const selectedDate = ref({
  startDate: today,
  endDate: nextDay,
});

function hideModal() {
  isModalVisible.value = false;
}

function updateDate(date: any) {
  const newDate = new Date(date);
  const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + 1);

  selectedDate.value = {
    startDate: startDate,
    endDate: nextDate,
  };
}



</script>
