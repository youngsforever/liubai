<script setup lang="ts">
import PageDefault from "~/pages/shared/page-default/page-default.vue";
import { useI18n } from "vue-i18n";
import { useConnectWps } from "./tools/useConnectWps"

const { t } = useI18n()
const { 
  cwData,
} = useConnectWps()

</script>
<template>

  <PageDefault title-key="connect.wps">

    <PlaceholderView
      :p-state="cwData.pageState"
    ></PlaceholderView>

    <div class="cw-container" v-if="cwData.pageState < 0">

      <div class="cw-bar">
        <div class="liu-no-user-select cwb-title">
          <span>{{ t('connect.wps_backup') }}</span>
        </div>

        <div class="liu-no-user-select cwb-footer">
          <liu-switch 
            :checked="cwData.webhook_toggle"
          ></liu-switch>
        </div>

      </div>

      <div class="cw-desc">
        <span class="liu-selection">{{ t('connect.wps_backup_desc') }}</span>
      </div>

    </div>

  </PageDefault>

</template>
<style scoped lang="scss">
@use "../shared/connect-layout.scss";

</style>