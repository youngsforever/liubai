

import { reactive, toRef } from "vue";
import type { IbChildData, IbChildProps } from "./types";
import { useOpenClose } from "~/hooks/useOpenClose";

export function useIbChild(props: IbChildProps) {
  const icData = reactive<IbChildData>({
    enable: false,
    show: false,
  })

  const isOn = toRef(props, "expand")
  useOpenClose(isOn, icData)

  return { icData }
}