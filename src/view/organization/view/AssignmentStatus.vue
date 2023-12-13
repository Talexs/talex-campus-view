<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { assignmentModel } from '~/plugins/model/assignment/AssignmentModel'

const props = defineProps<{
  assignment_id?: boolean,
}>()

const data = ref<any>(null)

onMounted(async () => {
  const assignment_id = +props.assignment_id

  data.value = await assignmentModel.distributionList(assignment_id)
})

</script>

<template>
  <div>
    {{ data }}
  </div>
</template>