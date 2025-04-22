<template>
    <div>
      <button class="custom-btn" :class="props.status" @click="selectChannel">
        <i class="material-icons fs-2 px-2">{{getIcon()}}</i>
        <span class="fs-5 font-weight-bold">
          {{ props.name }}
        </span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">

  import { TrendStatus } from '@/enum/TrendStatus';
  
  const props = defineProps({
    name: {
      type: String,
      default: ''
    },
    channel_id: {
      type: Number,
      required: true
    },
    status: {
      type:String,
      default: TrendStatus.no_issue
    }
  });
  
  const emit = defineEmits(['channel-selected']);
  
  function selectChannel() {
    //データがない場合はボタンを押されても何もしない
    if (props.status === TrendStatus.no_data) {
      return;
    }
    emit('channel-selected', props.channel_id);
  }

  function getIcon() {
    if (props.status === TrendStatus.no_data) {
        return 'radio_button_unchecked';
    } else if (props.status === TrendStatus.no_issue) {
      return 'check_circle';
    } else if (props.status === TrendStatus.checked_issue) {
      return 'warning';
    } else if (props.status === TrendStatus.not_checked_issue) {
      return 'error';
    } else {
      return 'error';
    }
  }
  </script>
  
  <style scoped>
  .custom-btn {
    padding: 3px;
    font-size: 1.6rem;
    border-radius: 15px;
    border: 0;
    color: #e3e3e3;
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
  }
  
  .custom-btn:hover {
    color: white;
  }

  .no_data {
    background-color: #595959;
  }

  .no_data:hover {
    /*データがない場合はホバーしても何も反応していないように見せる*/
    background-color: #595959;
    color: #e3e3e3;
  }

  .no_issue {
    background-color: #00802c;
  }

  .no_issue:hover {
    background-color: #00b33c;
    box-shadow: 0 0 10px 3px rgba( 61,255,127, 0.3) !important;
  }
  
  .checked_issue {
    background-color: #bc4601;
  }

  .checked_issue:hover {
    background-color: #f55a00;
    box-shadow: 0 0 10px 3px rgba( 255,255,61, 0.3) !important;
  }
  
  .not_checked_issue {
    background-color:#bc2601 ;
  }

  .not_checked_issue:hover {
    background-color: #ff3300;
    box-shadow: 0 0 10px 3px rgba( 255,61,61, 0.3) !important;
  }
  </style>
  