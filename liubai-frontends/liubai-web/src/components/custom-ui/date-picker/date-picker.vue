<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { enUS, zhCN, zhTW } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { SupportedLocale } from '~/types/types-locale';
import liuUtil from "~/utils/liu-util";
import { initDatePicker } from "./index"
import { useSystemStore } from '~/hooks/stores/useSystemStore';
import { storeToRefs } from 'pinia';

const systemStore = useSystemStore()
const { supported_theme } = storeToRefs(systemStore)
const { locale, t } = useI18n()
const dayNames = liuUtil.getDayNames()

// v14 of vue-datepicker requires a date-fns `Locale` object instead of a string
const dpLocale = computed<Locale>(() => {
  const lang = locale.value as SupportedLocale
  if(lang === "zh-Hans") return zhCN
  if(lang === "zh-Hant") return zhTW
  return enUS
})

const {
  enable,
  show,
  date,
  timeStr,
  minDate,
  maxDate,
  TRANSITION_DURATION: dpTranMs,
  onTapConfirm,
  onTapCancel,
} = initDatePicker()

const handleInternal = (newDate: Date) => {
  if(!date.value) {
    date.value = newDate
    return
  }
  const res = liuUtil.areTheDatesEqual(date.value, newDate)
  if(res) return
  date.value = newDate
}

const previewDate = computed(() => {
  const lang = locale.value as SupportedLocale
  const d = date.value
  if(!d) return ""
  return liuUtil.showBasicTime(d, lang)
})

</script>
<template>

  <div v-if="enable"
    class="liu-no-user-select liu-dp-container"
    :class="{ 'liu-dp-container_show': show }"
  >
    <div class="liu-dp-bg" @click.stop="onTapCancel"></div>

    <VueDatePicker
      :locale="dpLocale"
      :dayNames="dayNames"
      weekStart="0" 
      :dark="supported_theme === 'dark'"
      inline
      v-model="date"
      :min-date="minDate"
      :max-date="maxDate"
      :ui="{
        menu: 'dp-custom-menu',
        calendar: 'dp-custom-calendar-wrapper',
        calendarCell: 'dp-custom-cell',
      }"
      minutesIncrement="5"
      @internalModelChange="handleInternal"
    >

      <template #action-preview="{ value }">
        <span>{{ previewDate }}</span>
      </template>

      <!-- 按钮区域 -->
      <template #action-buttons>
        <div class="liu-dp-btns">
          <div class="liu-hover liu-dp-btn liu-dp-cancel" @click="onTapCancel">
            <span>{{ t("common.cancel") }}</span>
          </div>

          <div class="liu-hover liu-dp-btn liu-dp-confirm" @click="onTapConfirm">
            <span>{{ t("common.confirm") }}</span>
          </div>

        </div>
      </template>

      <!-- 选择时间 -->
      <template #clock-icon>
        <div class="liu-dp-clock-calendar">
          <svg-icon name="when" class="liu-dcc-icon" color="var(--dp-icon-color)"></svg-icon>
          <span>{{ timeStr ? timeStr : t("date_picker.select_time") }}</span>
        </div>
      </template>

      <!-- 返回 -->
      <template #calendar-icon>
        <div class="liu-dp-clock-calendar">
          <svg-icon name="arrow-back" class="liu-dcc-icon" color="var(--dp-icon-color)"></svg-icon>
          <span>{{ t("common.back") }}</span>
        </div>
      </template>


    </VueDatePicker>

  </div>

  

</template>
<style scoped lang="scss">

.liu-dp-container {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: v-bind("dpTranMs + 'ms'");
  opacity: 0;

  &.liu-dp-container_show {
    opacity: 1;
  }
}

.liu-dp-bg {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: var(--popup-bg);
}

.liu-dp-btns {
  flex: 1;
  display: flex;
  justify-content: flex-end;

  .liu-dp-btn {
    padding: 5px 10px;
    font-size: var(--btn-font);
    font-weight: 700;
  }

  .liu-dp-cancel {
    color: var(--main-text);
    margin-right: 5px;
  }

  .liu-dp-confirm {
    color: var(--primary-color);
  }

}

.liu-dp-clock-calendar {
  display: flex;
  align-items: center;
  font-size: var(--btn-font);
  font-weight: 700;
  color: var(--dp-icon-color);

  .liu-dcc-icon {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    margin-right: 4px;
  }
}

</style>
<style lang="scss">

.liu-dp-container {
  --dp-menu-padding: 0;
  --dp-cell-padding: 0;

  .dp--flex-display {
    width: min-content;
    justify-content: center;

    .dp--outer-menu-wrap {
      display: flex;
      justify-content: center;
    }
  }

  .dp--theme-light  {
    --dp-primary-color: var(--primary-color);
    --dp-background-color: var(--card-bg);
    --dp-border-color: var(--line-default);
  }

  .dp--theme-dark {
    --dp-primary-color: var(--primary-color);
    --dp-background-color: var(--card-bg);
    --dp-text-color: var(--main-text);

    .dp--range-border-end, .dp--range-border-start, .dp--active {
      color: var(--on-primary);
    }
  }

  .dp-custom-menu {
    padding: 20px 20px 10px;
    border-radius: 20px;

    .dp--button {
      border-radius: 4px;
    }

    .dp--tp-wrap {
      max-width: 100%;
    }

  }

  .dp-custom-calendar-wrapper {

    .dp--calendar-header {
      margin-block-start: 10px;
    }

    .dp--calendar-header-item {
      width: 46px;
      height: 35px;
      max-width: 13vw;
      max-height: 13vw;
      flex-grow: 0;
    }

    .dp--calendar-item {
      outline: none;
      flex-grow: 0;
    }

    .dp-custom-cell {
      border-radius: 50%;
      width: 46px;
      height: 46px;
      max-width: 13vw;
      max-height: 13vw;
      transition: .16s;
      font-size: var(--btn-font);
    }
  }

  .dp--action-row {
    padding: 5px 0px 10px 10px;

    .dp--action-buttons {
      flex: 1; 
    }
  }

  /********************* hover & active style for Mobile ****************/
  .dp--button:hover, 
  .dp--month-year-select:hover, 
  .dp--overlay-cell:hover, 
  .dp--time-display:hover:enabled, 
  .dp--date-hoverable-end:hover, 
  .dp--date-hoverable-start:hover,
  .dp--date-hoverable:hover {
    background: none;
  }

  .dp--cell-offset.dp--date-hoverable:hover {
    color: var(--dp-secondary-color);
  }

  .dp--inc-dec-button:hover {
    background: none;
    color: var(--dp-icon-color);
  }

  @media(hover: hover) {
    .dp--button:hover,
    .dp--month-year-select:hover, 
    .dp--overlay-cell:hover,
    .dp--time-display:hover:enabled,
    .dp--date-hoverable-end:hover, 
    .dp--date-hoverable-start:hover,
    .dp--date-hoverable:hover {
      background: var(--dp-hover-color);
    }

    .dp--cell-offset.dp--date-hoverable:hover {
      color: var(--dp-hover-text-color);
    }

    .dp--inc-dec-button:hover {
      background: var(--dp-hover-color);
      color: var(--dp-primary-color);
    }
  }

  .dp--button:active,
  .dp--month-year-select:active, 
  .dp--overlay-cell:active,
  .dp--time-display:active:enabled,
  .dp--date-hoverable-end:active, 
  .dp--date-hoverable-start:active,
  .dp--date-hoverable:active {
    background: var(--dp-hover-color);
  }

  .dp--cell-offset.dp--date-hoverable:active {
    color: var(--dp-hover-text-color);
  }

  .dp--inc-dec-button:active {
    background: var(--dp-hover-color);
    color: var(--dp-primary-color);
  }


  /******************* responsive style for Mobile *****************/
  @media screen and (max-width: 400px) {
    .dp-custom-menu {
      padding: 10px 10px 10px;
    }

    .dp--action-row {
      padding: 5px 0 5px 5px;
    }
  }

  @media screen and (max-width: 370px) {

    .dp-custom-menu {
      padding: 10px 2vw 10px;
    }

    .dp--action-row {
      padding: 0px;
      padding-inline-start: 5px;
    }
  }

}

</style>