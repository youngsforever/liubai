import type { PeopleTasksAPI } from "~/requests/req-types";
import type { TaskItem } from "~/types/types-task";

export function showTaskItems(
  tasks: PeopleTasksAPI.WxTaskItem[],
) {
  const list: TaskItem[] = []

  for(let i=0; i<tasks.length; i++) {
    const task = tasks[i]
    let allDone: boolean | undefined
    let doneCount: number | undefined
    if(task.infoType === "TASK" && task.assigneeList.length > 0) {
      allDone = true
      doneCount = 0
      task.assigneeList.forEach(v => {
        if(v.doneStamp) {
          doneCount = (doneCount as number) + 1
        }
        else {
          allDone = false
        }
      })
    }

    const obj: TaskItem = {
      ...task,
      allDone,
      doneCount,
    }
    list.push(obj)
  }
  return list
}