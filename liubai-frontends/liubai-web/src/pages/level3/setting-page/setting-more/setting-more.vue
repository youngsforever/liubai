<script setup lang="ts">
import AppLink from '~/components/common/app-link/app-link.vue';
import PageDefault from "~/pages/shared/page-default/page-default.vue";
import { useSettingMore } from "./tools/useSettingMore";
import { useI18n } from "vue-i18n";

const {
  prefix,
  serviceTermsLink,
  privacyPolicyLink,
} = useSettingMore()

const { t } = useI18n()

const iconColor = "var(--main-normal)"

</script>
<template>
  <PageDefault title-key="common.more">
    <!-- import & export -->
    <div class="liu-no-user-select sc-title">
      <span>{{ t('setting.import_export') }}</span>
    </div>
    <div class="sc-box">
      <!-- 导入 -->
      <AppLink :to="prefix + 'import'">
        <div class="liu-no-user-select liu-hover sc-bar">
          <div class="scb-hd">
            <span>{{ t('setting.import') }}</span>
          </div>
          <div class="scb-footer">
            <div class="scb-footer-icon">
              <svg-icon class="scbf-svg-icon scbf-import" name="arrow_outward" :color="iconColor"></svg-icon>
            </div>
          </div>
        </div>
      </AppLink>

      <!-- 导出 -->
      <AppLink :to="prefix + 'export'">
        <div class="liu-no-user-select liu-hover sc-bar">
          <div class="scb-hd">
            <span>{{ t('setting.export') }}</span>
          </div>
          <div class="scb-footer">
            <div class="scb-footer-icon">
              <svg-icon class="scbf-svg-icon" name="arrow_outward" :color="iconColor"></svg-icon>
            </div>
          </div>
        </div>
      </AppLink>

    </div>


    <!-- rules -->
    <div class="liu-no-user-select sc-title">
      <span>{{ t('setting.terms') }}</span>
    </div>
    <div class="sc-box">
      <!-- Service Terms -->
      <a class="liu-no-user-select liu-hover sc-bar" target="_blank"
        :href="serviceTermsLink"
      >
        <div class="scb-hd">
          <span>{{ t('setting.service_terms') }}</span>
        </div>
        <div class="scb-footer">
          <div class="scb-footer-icon">
            <SvgIcon class="scbf-back" name="arrow-right2" :color="iconColor"></SvgIcon>
          </div>
        </div>
      </a>

      <!-- Privacy Policy -->
      <a class="liu-no-user-select liu-hover sc-bar" target="_blank"
        :href="privacyPolicyLink"
      >
        <div class="scb-hd">
          <span>{{ t('setting.privacy_policy') }}</span>
        </div>
        <div class="scb-footer">
          <div class="scb-footer-icon">
            <SvgIcon class="scbf-back" name="arrow-right2" :color="iconColor"></SvgIcon>
          </div>
        </div>
      </a>

    </div>

  </PageDefault>

</template>
<style scoped lang="scss">

.sc-title {
  font-size: var(--desc-font);
  font-weight: 700;
  color: var(--main-normal);
  margin-inline-start: 10px;
  margin-block-end: 8px;
}

.sc-box {
  background-color: var(--card-bg);
  border-radius: 24px;
  position: relative;
  padding: 16px 10px 12px 10px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: var(--card-shadow-2);
  margin-block-end: 32px;
  container-type: inline-size;
  container-name: sc-box;
}


.sc-bar {
  width: 100%;
  border-radius: 8px;
  position: relative;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 10px;

  &::before {
    border-radius: 8px;
  }
}

.scb-hd {
  font-size: var(--desc-font);
  color: var(--main-normal);
  font-weight: 700;
}

.scb-footer {
  flex: 1 0 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.scb-footer-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.scbf-svg-icon {
  width: 22px;
  height: 22px;
}

.scbf-import {
  transform: rotate(180deg);
}

.scbf-back {
  width: 18px;
  height: 18px;
  transition: .3s;
}

</style>