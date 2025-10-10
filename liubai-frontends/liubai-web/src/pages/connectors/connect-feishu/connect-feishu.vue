<script setup lang="ts">
import PageDefault from "~/pages/shared/page-default/page-default.vue";
import { useI18n } from "vue-i18n";
import { useConnectFeishu } from "./tools/useConnectFeishu"

const { t } = useI18n()
const { 
  cwData,
  onBackupChanged,
  onBackupInput,
  onTapSave,
  onTapConfigMethod,
} = useConnectFeishu()

</script>
<template>

  <PageDefault title-key="connect.feishu">

    <PlaceholderView
      :p-state="cwData.pageState"
    ></PlaceholderView>

    <div class="cw-container" v-if="cwData.pageState < 0">

      <div class="cw-bar">
        <div class="liu-no-user-select cwb-title">
          <span>{{ t('connect.feishu_backup') }}</span>
        </div>

        <div class="liu-no-user-select cwb-footer">
          <liu-switch 
            :checked="cwData.backup_toggle"
            @change="onBackupChanged($event.checked)"
          ></liu-switch>
        </div>

      </div>

      <div class="cw-desc">
        <span class="liu-selection">{{ t('connect.feishu_backup_desc') }}</span>
      </div>

      <!-- show if toggle is true -->
      <div class="cw-panel" v-if="cwData.backup_toggle">

        <!-- Personal Base Token -->
        <div class="liu-no-user-select cw-question">
          <span>{{ t('connect.feishu_personalBaseToken') }}</span>
        </div>
        <input type="text" 
          v-model="cwData.personal_base_token" 
          class="ph-no-capture cw-answer" 
          :placeholder="t('connect.feishu_personalBaseToken_ph')"
          @input="onBackupInput"
          maxlength="72"
          autocomplete="off"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
        />

        <!-- Base ID -->
        <div class="liu-no-user-select cw-question">
          <span>{{ t('connect.feishu_base_id') }}</span>
        </div>
        <input type="text" 
          v-model="cwData.base_id" 
          class="ph-no-capture cw-answer" 
          :placeholder="t('connect.feishu_base_id_ph')"
          @input="onBackupInput"
          maxlength="48"
          autocomplete="off"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
        />

        <!-- Table ID -->
        <div class="liu-no-user-select cw-question">
          <span>{{ t('connect.feishu_table_id') }}</span>
        </div>
        <input type="text" 
          v-model="cwData.table_id" 
          class="ph-no-capture cw-answer" 
          :placeholder="t('connect.feishu_table_id_ph')"
          @input="onBackupInput"
          maxlength="48"
          autocomplete="off"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
        />

        <!-- buttons -->
        <div class="cw-btns">
          <custom-btn 
            size="mini" 
            type="transparent"
            @click="onTapConfigMethod"
          >
            <span>{{ t('connect.check_config') }}</span>
          </custom-btn>
          <custom-btn 
            size="mini" 
            class="cw-save-btn"
            :disabled="!cwData.canSave"
            :is-loading="cwData.isSaving"
            @click="onTapSave"
          >
            <span>{{ t('common.save') }}</span>
          </custom-btn>
        </div>

      </div>
      

    </div>

  </PageDefault>

</template>
<style scoped lang="scss">
@use "../shared/connect-layout.scss";

</style>