<template>
  <div class="FlatInput-Container">

    <div @click="inputFocus"
         :class="{ 'mode-pass-focus': passFocus, 'mode-pass-view': !passEye }"
         v-if="pass && content" class="FlatInput-Mode-Pass">
      <div :style="`--delay: all .25s ${i * 10}ms`" v-for="i in Math.min(String(content).length, maxPassDotNum)" class="FlatInput-Mode-Pass__ball">
      </div>
      <div class="FlatInput-Mode-Pass__selector">

      </div>
    </div>

    <div class="FlatInput-Input-Container__inner" :class="{ 'mode-pass-focus': pass && passFocus }">
      <input autofocus autocomplete="true" :placeholder="placeholder" ref="inputRef" @blur="passFocus = false" @focus="passFocus = true" class="FlatInput-Input" :type="!pass || !passFocus ? 'text' : 'password'" v-model="content" />
    </div>

    <!--    // div: const emits = defineEmits(['click']);-->
    <div class="FlatInput-Icon-Container">
      <div v-if="pass" @click="passEye = !passEye" class="FlatInput-Suffix">
        <ViewEye :visible="passEye" />
      </div>
      <div v-else class="FlatInput-Suffix">
        <slot name="suffix"></slot>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ViewEye from './../icon/ViewEye.vue'

import { debounceRef, useModelWrapper } from './../../../plugins/Common'

const emits = defineEmits(['update:modelValue', 'click', 'jinitaimei'])
const props = defineProps({ modelValue: String, pass: Boolean, placeholder: String, maxPassDotNum: { type: Number, default: 18 } })

const content = useModelWrapper(props, emits)

const passFocus = ref(false)
const passEye = debounceRef(true, 300)

const inputRef = ref(null)

const inputFocus = ref(() => {

  inputRef.value?.focus()

})

</script>

<script>
export default {
  name: "FlatInput"
}
</script>

<style lang="scss" scoped>
.FlatInput-Mode-Pass {
  z-index: 100;
  .FlatInput-Mode-Pass__ball {
    position: relative;
    //display: inline-block;
    margin-right: 1px;

    left: 3px;
    top: 50%;

    height: 8px;
    width: 8px;

    background-color: var(--el-text-color-primary);
    border-radius: 50%;
    transform: translateY(-50%);
    transition: var(--delay);
  }
  position: absolute;
  display: flex;
  padding: 0 4px;

  left: 0;
  top: 2px;

  max-width: calc(100% - 36px);
  height: calc(100% - 4px);
  font-size: 15px;
  border-radius: var(--border-radius-inner, 8px);
  background-color: var(--input-bg, var(--el-fill-color-light));
  transition: all .125s;
}

.FlatInput-Icon-Container {
  .FlatInput-Suffix {
    :deep(.el-icon) {
      position: relative;
      margin-left: 8px;

      top: 6px;
      right: 4px;

    }
    :deep(.ViewEye-Container) {

      margin-left: 7px;

      top: 2px;
      right: 2px;

    }
    position: relative;

    top: 1px;
    height: calc(100% - 2px);

    margin-right: 5px;

    background-color: var(--input-bg, var(--el-fill-color-light));
    border-radius: var(--border-radius-inner, 8px);
  }
  position: relative;
  cursor: pointer;
}

.FlatInput-Input-Container__inner.mode-pass-focus {
  input::selection {

    color: rgba(0, 0, 0, 0);
    background-color: currentColor;

    opacity: 0;

  }
}

:deep(input) {
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px var(--input-bg, var(--el-fill-color-light)) inset;
  }
}

.FlatInput-Input-Container__inner {
  position: relative;

  flex: 1;

  .FlatInput-Input {
    position: relative;
    padding: 0 4px;

    width: calc(100% - 16px);
    height: calc(100% - 4px);

    top: 1px;

    font-size: 15px;
    outline: none;
    border: none;
    background-color: var(--input-bg, var(--el-fill-color-light)) !important;
    border-radius: var(--border-radius-inner, 8px);
    transition: .3s cubic-bezier(.25,.8,.25,1);
    &:before {
      content: v-bind(placeholder);//attr(placeholder);
      position: absolute;

      left: 0;
      top: 0;

      width: max-content;

      opacity: 0;
      transform: translateX(3px);
      transition: .3s cubic-bezier(.25,.8,.25,1);
    }
    &:empty {

      width: calc(100% - 16px);

      left: 3px;

      &:before {

        opacity: .75;
        transform: translateX(0);

      }

    }
  }
}

@keyframes selectorShave {

  0% {

    transform: rotate(0) scaleY(0.25);

  }

  25%, 100% {

    transform: rotate(180deg) scaleY(1);

  }

}

.FlatInput-Mode-Pass__selector {
  z-index: 100;
  position: relative;

  left: -1px;
  top: 10%;

  width: 1px;
  height: 80%;

  opacity: 0;
  background-color: var(--el-color-primary);
  animation: selectorShave 1s linear infinite;
  transition: .3s cubic-bezier(.25,.8,.25,1);
}

.FlatInput-Container {
  &:hover, &:focus {

    border: 2px solid var(--el-color-primary);

  }
  .mode-pass-focus {
    .FlatInput-Mode-Pass__selector {

      left: 4px;

      opacity: 1;
    }

  }
  .FlatInput-Mode-Pass.mode-pass-view {
    opacity: 0;
    transition: all .25s .3s;
  }
  .mode-pass-view {
    .FlatInput-Mode-Pass__ball {

      transform: translateY(-50%) scale(0);

    }
  }
  position: relative;
  margin: 15px 0;
  display: inline-flex;
  flex-direction: row;

  width: calc(100% - 4px);
  height:  calc(100% - 4px);
  min-height: 32px;

  border: 2px solid var(--el-color-primary-light-3);
  border-radius: var(--border-radius-inner, 8px);
  background-color: var(--input-bg, var(--el-fill-color-light));
  transition: .3s cubic-bezier(.25,.8,.25,1);
}
</style>
