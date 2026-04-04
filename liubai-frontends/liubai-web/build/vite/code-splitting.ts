function normalizeModuleId(id: string) {
  return id.replace(/[\\]/g, "/")
}

function normalizePackageName(name: string) {
  return name
    .replace(/^@/, "")
    .replace(/[\\/]/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
}

function getPackageName(id: string) {
  const normalizedId = normalizeModuleId(id)
  const parts = normalizedId.split("node_modules/")
  const modulePath = parts.at(-1)
  if (!modulePath) return null

  const segments = modulePath.split("/")
  const first = segments[0]
  if (!first) return null

  if (first.startsWith("@")) {
    const second = segments[1]
    if (!second) return normalizePackageName(first)
    return normalizePackageName(`${first}/${second}`)
  }

  return normalizePackageName(first)
}

function getVendorChunkName(moduleId: string) {
  const id = normalizeModuleId(moduleId)
  if (!id.includes("node_modules")) return null

  if (id.includes("/vue/") || id.includes("/vue-router/") || id.includes("/pinia/")) {
    return "vue-core"
  }

  if (id.includes("/vue-i18n/") || id.includes("/@intlify/")) {
    return "vue-i18n"
  }

  if (
    id.includes("/floating-vue/") ||
    id.includes("/@floating-ui/") ||
    id.includes("/vue-slicksort/") ||
    id.includes("/vue-draggable-resizable/")
  ) {
    return "ui-vendor"
  }

  if (id.includes("/dexie/") || id.includes("/flexsearch/")) {
    return "search-vendor"
  }

  const packageName = getPackageName(id)
  if (packageName) {
    return `vendor-${packageName}`
  }

  return "vendor"
}

export const vendorCodeSplitting = {
  groups: [
    {
      test: "node_modules",
      minSize: 12 * 1024,  // 12 KB
      name: getVendorChunkName,
    },
  ],
}
