<template>
    <div id="myCal"></div>
  </template>
  
  <script setup lang="ts">
  import { ref ,onMounted , watch} from "vue";
  // @ts-expect-error
  import Calendar from "color-calendar/dist/bundle.js";
  import "color-calendar/dist/css/theme-glass.css";
  import * as api from "@/api";

  const props = defineProps({
    modelValue: {
      type: Date,
      required: true
    }
  });

// emitの定義
const emit = defineEmits(["update:modelValue"]);
const currentMonth = ref(new Date(1999, 1, 1));//初期値は適当
const isFirstChange = ref(true);

  const myCal = ref();
onMounted(() => {
  myCal.value =new Calendar({
        id: "#myCal",
        theme: "glass",
        primaryColor: "#4b0082",
        headerBackgroundColor: "#4b0082",
        headerColor: "#fff",
        calendarSize: "large",
        customWeekdayValues:["日", "月", "火", "水", "木", "金", "土"],
        customMonthValues:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dateChanged: (currentDate:any) => {
          emit("update:modelValue", currentDate);
        },
        monthChanged: (currentMonth:any) => {
          //カレンダー初期化時には強制的に当日を選択する仕様のため、初回の変更は無視
        if (isFirstChange.value){
          isFirstChange.value = false;
          return;
        }
        if(isUpdateMonth(currentMonth)){
          console.log(currentMonth);
          addEvents(currentMonth);
        }
        },
      });
    myCal.value.setDate(props.modelValue);
  }); 
  
  async function addEvents(date:Date){
    const start_date=new Date(date.getFullYear(),date.getMonth(),1);
    const end_date=new Date(date.getFullYear(),date.getMonth()+1,1);
    const events = await api.getIsDataExist(start_date,end_date);
    const processedEvents = events.map((event:any) => {
      return {
        start: event.start_time,
        end: event.end_time,
        color: event.color,
      };
    });
    console.log(processedEvents);
    myCal.value.setEventsData(processedEvents);
  }

  function isUpdateMonth(newDate:Date):boolean{
    if (currentMonth.value.getMonth() === newDate.getMonth()&&currentMonth.value.getFullYear() === newDate.getFullYear()){
      return false;
    }
    else{
      currentMonth.value = newDate;
      return true;
    }
  }

  watch(() => props.modelValue, (newVal) => {
    myCal.value.setDate(newVal);
  });
  </script>
