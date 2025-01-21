<script setup lang="ts">
import { initHowxm } from 'howxm-js'
import { data } from '../../data/liu-config.data'

console.log("let's check out data in howxm-form: ")
console.log(data)

if(data.howxmId) {
  initHowxm(data.howxmId)
}

</script>
<template></template>