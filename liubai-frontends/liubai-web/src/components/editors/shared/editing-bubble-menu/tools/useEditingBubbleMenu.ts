import { inject } from 'vue'
import { deviceChaKey } from '~/utils/provide-keys'

export function useEditingBubbleMenu() {
  const cha = inject(deviceChaKey)
  return { cha }
}