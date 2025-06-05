<template>
	<div class="toggle-slider" :style="styleObject">
	  <label class="switch">
		<!-- 内部状態 isActiveRef をチェック状態にバインド -->
		<input
		  type="checkbox"
		  :checked="isActiveRef"
		  @click="onToggleByUser"
		/>
		<span class="track">
		  <span class="handle"></span>
		</span>
	  </label>
	</div>
  </template>
  
  <script setup lang="ts">
  import { computed,  onMounted,ref,toRefs, watch } from 'vue';
  
  // ---------------------------
  // props / emits
  // ---------------------------
  const props = defineProps({
	// v-model="..." の実態となるプロパティ名は modelValue
	modelValue: {
	  type: Boolean,
	  default: false
	},
	// 外観や初期値の設定
	options: {
	  type: Object,
	  default: () => ({})
	}
  });
  
  // v-model の更新イベント → `update:modelValue`
  // 独自のイベント → `toggle-changed`
  const emits = defineEmits(['update:modelValue', 'toggle-changed']);
  
  // ---------------------------
  // 定数やキー定義
  // ---------------------------
  const PROP_KEYS = {
	DIAMETER: 'diameter',
	COLOR: 'color',
	BORDER_RADIOUS: 'borderRadius',
	BORDER_WIDTH: 'borderWidth',
	WIDTH: 'width',
	HEIGHT: 'height',
	ACTIVE_COLOR: 'activeColor',
  } as const;
  
  // ---------------------------
  // 状態管理
  // ---------------------------
  const isActiveRef = ref<boolean>(props.modelValue); // 内部ステート
  const {modelValue}=toRefs(props);
  const lastChangeOrigin = ref<'user' | 'external' | null>(null);
  
  const handle = ref({
	diameter: 20,
	distance: 25,
	color: '#fff',
	borderRadius: '50%'
  });
  
  const track = ref({
	color: '#ccc',
	width: 40,
	height: 20,
	activeColor: '#ffd700',
	borderWidth: 0,
	borderRadius: '34px'
  });
  
  // ---------------------------
  // ウォッチ: 外部から modelValue が変わったら内部状態に反映
  // ---------------------------
  watch( modelValue,
	(newVal) => {
	  if (newVal !== isActiveRef.value) {
		isActiveRef.value = newVal;
		lastChangeOrigin.value = 'external';
		// 外部変更を通知したい場合
		emits('toggle-changed', {
		  value: isActiveRef.value,
		  origin: 'external'
		});
	  }
	}
  );
  
  // ---------------------------
  // 設定を取り込む
  // ---------------------------
  function setConfigData() {
	if (!props.options) return;
  
	// handle 部分
	if (props.options.handle) {
	  [
		PROP_KEYS.COLOR,
		PROP_KEYS.DIAMETER,
		PROP_KEYS.BORDER_RADIOUS
	  ].forEach((key) => {
		if (props.options.handle[key] !== undefined) {
		  (handle.value as any)[key] = props.options.handle[key];
		}
	  });
	}
  
	// track 部分
	if (props.options.track) {
	  [
		PROP_KEYS.COLOR,
		PROP_KEYS.WIDTH,
		PROP_KEYS.HEIGHT,
		PROP_KEYS.ACTIVE_COLOR,
		PROP_KEYS.BORDER_WIDTH,
		PROP_KEYS.BORDER_RADIOUS
	  ].forEach((key) => {
		if (props.options.track[key] !== undefined) {
		  (track.value as any)[key] = props.options.track[key];
		}
	  });
	}
  
	// 外部から初期状態を渡す場合
	if (typeof props.options.isActive === 'boolean') {
	  isActiveRef.value = props.options.isActive;
	}
  }
  
  // ---------------------------
  // ライフサイクル
  // ---------------------------
  onMounted(() => {
	setConfigData();
  });
  
  // ---------------------------
  // ユーザー操作
  // ---------------------------
  function onToggleByUser() {
	// チェックボックスの状態を手動で反転
	isActiveRef.value = !isActiveRef.value;
	lastChangeOrigin.value = 'user';
  
	// v-model を更新
	emits('update:modelValue', isActiveRef.value);
  
	// カスタムイベント通知
	emits('toggle-changed', {
	  value: isActiveRef.value,
	  origin: 'user'
	});
  }
  
  // ---------------------------
  // スタイル計算
  // ---------------------------
  const handleDistance = computed(() => {
	// options で handle.diameter, track.width が指定されている場合
	if (props.options?.handle && props.options?.track) {
	  return props.options.track.width - props.options.handle.diameter;
	}
	// デフォルト値
	return handle.value.distance;
  });
  
  const styleObject = computed(() => {
	return {
	  '--handle-diameter': handle.value.diameter + 'px',
	  '--handle-color': handle.value.color,
	  '--handle-border-radius': handle.value.borderRadius,
	  '--handle-distance': handleDistance.value + 'px',
	  '--track-color': track.value.color,
	  '--track-width': track.value.width + 'px',
	  '--track-height': track.value.height + 'px',
	  '--track-active-color': track.value.activeColor,
	  '--track-border-width': track.value.borderWidth + 'px',
	  '--track-border-radius': track.value.borderRadius
	};
  });
  </script>
  
  <style scoped lang="scss">
  .switch {
	position: relative;
	display: inline-block;
	width: var(--track-width);
	height: var(--track-height);
  
	input {
	  display: none;
	}
  
	.track {
	  display: flex;
	  align-items: center;
	  position: absolute;
	  width: 100%;
	  height: 100%;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background-color: var(--track-color);
	  cursor: pointer;
	  border: var(--track-border-width) solid var(--track-color);
	  border-radius: var(--track-border-radius);
	  transition: 0.4s;
  
	  .handle {
		display: flex;
		width: var(--handle-diameter);
		height: var(--handle-diameter);
		background-color: var(--handle-color);
		border-radius: var(--handle-border-radius);
		transition: 0.4s;
	  }
	}
  
	input:checked + .track {
	  background-color: var(--track-active-color);
	  border: var(--track-border-width) solid var(--track-active-color);
	}
  
	input:focus + .track {
	  box-shadow: 0 0 1px var(--track-active-color);
	}
  
	input:checked + .track > .handle {
	  transform: translateX(var(--handle-distance));
	}
  }
  </style>
  