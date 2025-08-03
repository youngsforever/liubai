
import type { TipTapEditor } from '~/types/types-editor';
import liuApi from "~/utils/liu-api"
import { inject, ref, watch } from 'vue';
import valTool from '~/utils/basic/val-tool';
import cui from '~/components/custom-ui';
import { useRouteAndLiuRouter } from '~/routes/liu-router';
import liuUtil from '~/utils/liu-util';
import { deviceChaKey } from '~/utils/provide-keys';
import { useDebounceFn } from "~/hooks/useVueUse"
import { useGlobalStateStore } from '~/hooks/stores/useGlobalStateStore';
import { storeToRefs } from 'pinia';
import { shouldShow, type ShouldShowProps } from '~/utils/other/bubble-menu';

interface TcBubbleMenuOpt {
  editor?: TipTapEditor
}

interface FloatingUiOpt {
  placement: "top" | "bottom"
  onShow?: () => void
  onHide?: () => void
}


export function useBwBubbleMenu(
  opt: TcBubbleMenuOpt,
) {
  const selectedIndex = ref(-1)
  const enable = ref(true)

  const _toCloseToolTip = async () => {
    enable.value = false
    await valTool.waitMilli(300)
    enable.value = true
  }

  let stopWatchSelectionChange: (() => void) | undefined
  const removeSelectionChange = () => {
    stopWatchSelectionChange?.()
  }

  const checkSelection = useDebounceFn(() => {
    const selectedTxt = liuApi.getSelectionText()
    if(selectedTxt) return
    removeSelectionChange()
    _toCloseToolTip()
  }, 300)

  const setupSelectionChange = () => {
    // 1. remove original listener first if existed
    removeSelectionChange()

    // 2. start to listen
    const gs = useGlobalStateStore()
    const { lastSelectionChange } = storeToRefs(gs)
    stopWatchSelectionChange = watch(lastSelectionChange, (newV) => {
      checkSelection()
    })
  }

  const floatingOptions = {
    placement: "top",
    onShow: () => {
      setupSelectionChange()
    },
    onHide: () => {
      removeSelectionChange()
      const selection = window.getSelection()
      if(!selection) return
      const { isCollapsed } = selection
      if(!isCollapsed) selection.removeAllRanges()
    }
  } as FloatingUiOpt

  const rr = useRouteAndLiuRouter()

  const _toPickOneTool = async (idx: number, instantly = false) => {
    selectedIndex.value = idx
    if(!instantly) {
      await valTool.waitMilli(500)
    }
    selectedIndex.value = -1
    removeSelectionChange()
    _toCloseToolTip()
  }

  const onTapCopy = (e: Event) => {
    const text = _getSelectionText(opt.editor)
    if(text) {
      liuApi.copyToClipboard(text)
      cui.showSnackBar({ text_key: "common.copied" })
    }
    _toPickOneTool(0)
  }

  const onTapSearchIn = (e: Event) => {
    const text = _getSelectionText(opt.editor)
    if(text) {
      cui.showSearchEditor({ type: "search", initText: text })
    }
    _toPickOneTool(1, true)
  }

  const onTapSearchOut = (e: Event) => {
    const text = _getSelectionText(opt.editor)
    if(text) {
      liuUtil.open.openOutSearch(text, { rr })
    }
    _toPickOneTool(2)
  }

  const onTapBot = () => {
    const text = _getSelectionText(opt.editor)
    if(text) {
      rr.router.pushCurrentWithNewQuery(rr.route, { gpt3: text })
    }
    _toPickOneTool(3)
  }
  const cha = inject(deviceChaKey)

  const shouldShowBwBubbleMenu = (props: ShouldShowProps) => {
    const res1 = shouldShow(props)
    if(!res1) return false
    const selectedTxt = liuApi.getSelectionText()
    return Boolean(selectedTxt)
  }

  return {
    enable,
    selectedIndex,
    floatingOptions,
    onTapCopy,
    onTapSearchIn,
    onTapSearchOut,
    onTapBot,
    shouldShowBwBubbleMenu,
    cha,
  }
}

function _getSelectionText(
  editor?: TipTapEditor
) {
  if(!editor) {
    console.log("editor dose not exist..........")
    return ""
  }
  const { state } = editor
  const { doc, selection } = state
  const { from, to } = selection
  const str = doc.textBetween(from, to, "\n")
  return str
}