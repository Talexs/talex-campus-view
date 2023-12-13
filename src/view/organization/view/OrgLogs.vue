<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { organizationModel } from '~/plugins/model/org/OrganizationModel.ts'
const props = defineProps<{
  id: number
}>()

const logs = ref([])

onMounted(async () => {
  logs.value = await organizationModel.logs(props.id, {
    limit: 20
  })

  console.log(logs.value)
})

async function loadMore() {

  let time = logs.value[logs.value.length - 1]?.createdAt || new Date()

  if ( typeof time === 'string') time = new Date(time)

  const value = await organizationModel.logs(props.id, {
    before: time.getTime(),
    limit: 15
  })

  logs.value.push(...[...value].reverse())
}

</script>

<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in logs" :key="index"
         :timestamp="activity.createdAt">
        {{ activity.id }}: {{ activity.action  }}
        -- {{ activity.content }}
      </el-timeline-item>
    </el-timeline>

    <span @click="loadMore" style="cursor: pointer;margin-left: 65px">加载更多...</span>
  </div>
</template>