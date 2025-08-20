import { navibarBehavior } from "../../behaviors/navibar-behavior";
import { i18nBehavior } from "../../behaviors/i18n-behavior";
import { themeBehavior } from "../../behaviors/theme-behavior";
import { pageBehavior } from "../../behaviors/page-behavior";
import { 
  generateDateList, 
  generateHourMinute, 
  generateTimeValue,
} from "./tools/useDateTime";
import type { DateItem } from "./tools/types";

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("task-date-time"),
    navibarBehavior(),
    themeBehavior(),
    pageBehavior(),
  ],

  data: {
    pageName: "task-date-time",
    dateList: [] as DateItem[],
    hourList: [] as string[],
    minuteList: [] as string[],

    dateValue: [1],  // set default value to tomorrow
    timeValue: [0, 0],
    _dateValue: [1],
    _timeValue: [0, 0],
  },

  methods: {

    onLoad() {
      const { dateList } = generateDateList()
      const { hourList, minuteList } = generateHourMinute()
      const { timeValue } = generateTimeValue()
      
      this.setData({
        dateList,
        hourList,
        minuteList,
        timeValue,
        _timeValue: timeValue,
      })
    },

  }


})