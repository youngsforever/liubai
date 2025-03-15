

export function showModelName(
  model: string,
) {
  const m = model.toLowerCase()

  // R1
  if(m.includes("deepseek-r1")) return "DeepSeek R1"
  if(m.includes("deepseek-reasoner")) return "DeepSeek R1"
  
  // V3
  if(m.includes("deepseek-v3")) return "DeepSeek V3"
  if(m.includes("deepseek-chat")) return "DeepSeek V3"

  // QwQ 32B
  if(m.includes("qwq-32b")) return "QwQ 32B"

}