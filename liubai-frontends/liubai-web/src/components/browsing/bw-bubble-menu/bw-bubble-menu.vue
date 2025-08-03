
<script setup lang="ts">
import type { PropType } from 'vue';
import { BubbleMenu } from '@tiptap/vue-3/menus';
import type { TipTapEditor } from '~/types/types-editor';
import { useI18n } from 'vue-i18n';
import { useBwBubbleMenu } from "./tools/useBwBubbleMenu";

const bubbleColor = "var(--bubble-menu-color)"

const props = defineProps({
  editor: {
    type: Object as PropType<TipTapEditor>,
  }
})
const { t } = useI18n()
const {
  enable,
  selectedIndex,
  floatingOptions,
  onTapCopy,
  onTapSearchIn,
  onTapSearchOut,
  shouldShowBwBubbleMenu,
  cha,
} = useBwBubbleMenu(props)

const onTapContainer = () => {}

</script>
<template>

  <bubble-menu
    v-if="enable && cha?.isPC && editor"
    :editor="editor"
    :should-show="shouldShowBwBubbleMenu"
    :updateDelay="0"
    :options="floatingOptions"
  >

    <!-- 浏览时: 复制、内部搜索、外部搜索 -->
    <div class="bw-bubble-menu" @click.stop="onTapContainer">
      <!-- 复制 -->
      <div class="liu-no-user-select ec-bb-two"
        :class="{ 'ec-bb-two_selected': selectedIndex === 0 }"
        @click.stop="onTapCopy"
      >
        <svg-icon name="copy" :color="bubbleColor" class="ec-bubble-icon"></svg-icon>
        <span>{{ t('card_bubble.copy') }}</span>
      </div>

      <!-- 站内搜索 -->
      <div class="liu-no-user-select ec-bb-two"
        :class="{ 'ec-bb-two_selected': selectedIndex === 1 }"
        @click.stop="onTapSearchIn"
      >
        <svg-icon name="search" :color="bubbleColor" class="ec-bubble-icon"></svg-icon>
        <span>{{ t('card_bubble.search_in') }}</span>
      </div>

      <!-- 站外搜索 -->
      <div class="liu-no-user-select ec-bb-two"
        :class="{ 'ec-bb-two_selected': selectedIndex === 2 }"
        @click.stop="onTapSearchOut"
      >
        <svg-icon name="arrow_outward" :color="bubbleColor" 
          class="ec-bubble-icon_outward"
        ></svg-icon>
        <span>{{ t('card_bubble.search_out') }}</span>
      </div>
      
    </div>

  </bubble-menu>

</template>
<style scoped>

.bw-bubble-menu {
  padding: 0 10px;
  border-radius: 10px;
  display: flex;
  background-color: var(--bubble-menu-bg);
  margin: 10px;
  box-shadow: var(--bubble-menu-shadow);
  width: fit-content;
  flex-wrap: wrap;
  cursor: auto;
  z-index: 900;
  position: relative;
}

.ec-bb-two {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  font-size: var(--mini-font);
  color: var(--bubble-menu-color);
  transition: .15s;
  opacity: .96;
  cursor: pointer;
  position: relative;
  min-width: 50px;
  text-align: center;
}

.ec-bb-two::before {
  content: "";
  position: absolute;
  opacity: 0;
  transition: .1s;
  top: 5px;
  left: 5px;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  background-color: var(--bubble-menu-color);
  border-radius: 5px;
  overflow: hidden;
}

.ec-bb-two:hover {
  opacity: .7;
}

.ec-bb-two_selected::before {
  opacity: 0.1;
}

.ec-bubble-icon {
  width: 24px;
  height: 24px;
  margin-block-end: 4px;
  cursor: pointer;
}

.ec-bubble-icon_outward {
  width: 26px;
  height: 26px;
  margin-block-end: 2px;
}

</style>