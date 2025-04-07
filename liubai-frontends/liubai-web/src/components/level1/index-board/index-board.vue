<script setup lang="ts">
import { useIndexBoard } from './tools/useIndexBoard';
import A2hsTip from './a2hs-tip/a2hs-tip.vue';
import NewVersionTip from "./new-version-tip/new-version-tip.vue"
import SubscribePrompt from './subscribe-prompt/subscribe-prompt.vue';

const {
  ibData,
  onTapInstall,
  onTapCloseA2hsTip,
  onConfirmNewVersion,
  onCancelNewVersion,
  onTapViewSubscription,
  onTapCancelSubscription,
} = useIndexBoard()

</script>
<template>

  <A2hsTip
    :expand="ibData.a2hs"
    @confirm="onTapInstall"
    @cancel="onTapCloseA2hsTip"
  ></A2hsTip>

  <NewVersionTip
    :expand="ibData.newVersion"
    @confirm="onConfirmNewVersion"
    @cancel="onCancelNewVersion"
  ></NewVersionTip>

  <SubscribePrompt
    :expand="ibData.subscribePrompt"
    @confirm="onTapViewSubscription"
    @cancel="onTapCancelSubscription"
  ></SubscribePrompt>
  

</template>
<style scoped lang="scss">


</style>