<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCotPage } from './tools/useCotPage'

const { cpData } = useCotPage()
const { t } = useI18n()

</script>
<template>

  <div class="liu-simple-page">

    <div class="liu-mc-container">

      <PlaceholderView :p-state="cpData.pageState"></PlaceholderView>

    </div>
  </div>
</template>