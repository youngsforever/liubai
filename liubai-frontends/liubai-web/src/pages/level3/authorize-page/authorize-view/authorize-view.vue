<script setup lang="ts">
import type { LiuAppType } from '~/types/types-atom';
import type { PropType } from 'vue';

defineProps({
  appType: {
    type: String as PropType<LiuAppType>,
    required: true,
  }
})

defineEmits(["agree"])

</script>
<template>


</template>
<style scoped lang="scss">


</style>