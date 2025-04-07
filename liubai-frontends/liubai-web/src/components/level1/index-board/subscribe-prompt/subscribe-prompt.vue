<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { IbChildProps, IbChildEmits } from "../tools/types";
import { useLightBox } from "~/hooks/elements/useLightBox";
import { toRef } from "vue";
import { useIbChild } from "../tools/useIbChild";

const props = defineProps<IbChildProps>()
defineEmits<IbChildEmits>()

const { icData } = useIbChild(props)
const { t } = useI18n()

const icon_color = `var(--main-code)`

const show = toRef(icData, "show")
const { 
  cardRef, 
  isCursorIn,
} = useLightBox({ show })

</script>
<template>

  <div v-if="icData.enable" class="a2hs-container"
    :class="{ 'a2hs-container_show': icData.show }"
  >
    <div class="liu-highlight-box a2hs-box"
      ref="cardRef"
      :class="{ 'a2hs-box_show': icData.show }"
    >
      <div class="liu-no-user-select a2hs-first-bar">
        <span>{{ t('payment.subscription_prompt_1') }}</span>
        <div class="a2hsf-footer">
          <div class="a2hs-close-box" @click.stop="$emit('cancel')">
            <svg-icon name="close" class="a2hs-close-svg"
              :color="icon_color"
            ></svg-icon>
          </div>
        </div>
      </div>
      <div class="liu-no-user-select a2hs-desc">
        <span>{{ t('payment.subscription_prompt_2') }}</span>
      </div>
      <div class="a2hs-btn-bar">
        <custom-btn class="a2hs-btn" 
          type="main" 
          size="mini" 
          @click="$emit('confirm')"
        >
          <span class="a2hs-btn_span">{{ t('payment.let_me_see') }}</span>
        </custom-btn>
      </div>
    </div>
  </div>

</template>
<style lang="scss" scoped>
@use "../ib-child.scss";

.a2hs-container_show {
  overflow: v-bind("isCursorIn ? 'visible' : 'hidden'");
}

.a2hs-box_show {
  transition: v-bind("isCursorIn ? '0s' : '.3s'");
}

</style>