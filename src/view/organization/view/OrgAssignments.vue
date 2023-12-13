<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import TalexCoverDialog from '~/components/common/dialog/TalexCoverDialog.vue'
import { assignmentModel } from '~/plugins/model/assignment/AssignmentModel.ts'
import AddAssignment from '~/view/organization/view/AddAssignment.vue'
import { useStore } from '~/plugins/store/index.ts'

const store = useStore()
const props = defineProps<{
  org_id: number,
}>()

const addDialog = ref(false)
const assignments = ref([])

onMounted(async () => {

  if (!store.local.admin)
    assignments.value = await assignmentModel.list(props.org_id)
  else
    assignments.value = await assignmentModel.orgList(props.org_id)
})

</script>

<template>
  <div class="OrgAssignments">
    <div class="OrgAssignments-Header">
      <span>
        <FlatInput>
        </FlatInput>
      </span>
      <div class="OrgAssignments-Header-Aside">
        <FlatButton @click="addDialog = true" plain>
          <i class="el-icon-plus"></i>
          <span>新建作业</span>
        </FlatButton>
      </div>

    </div>
    <div class="OrgAssignments-Main">
      <div @click="$router.push(`/org/view/${org_id}/assignments/${item.id}`)" class="OrgAssignments-Item"
        v-for="item in assignments" :key="item.id">
        <div class="Item-Main">
          <h1>{{ item.title }}</h1>
          <p>{{ item.desc }}</p>
        </div>

        <div class="Item-Footer">
          <span class="Item-Deadline">
            {{ item.deadline }}</span>
          <span class="Item-Finished">
            {{ item.finished_by || 0 }} 已完成</span>

          <span v-if="item.type === 0">个人任务</span>
        </div>
      </div>
    </div>

    <TalexCoverDialog to="body" v-model="addDialog">
      <AddAssignment :org_id="props.org_id" />
    </TalexCoverDialog>
  </div>
</template>

<style lang="scss">
.Item-Footer {
  display: flex;

  gap: 1rem;
}

.OrgAssignments-Item {
  &:hover {
    cursor: pointer;

    background-color: var(--el-fill-color);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
  }

  background-color: var(--el-fill-color-light);
  border-radius: 12px;
  padding: 1rem;
  margin: .5rem;

  min-width: 380px;
  max-width: 30%;

  box-sizing: border-box;
}

.OrgAssignments-Main {
  display: flex;

  gap: 2rem;
  flex-wrap: wrap;

  justify-content: space-between;

  overflow: hidden;
}

.OrgAssignments-Header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem;
  height: 60px;
  border-bottom: 1px solid var(--el-border-color);
}
</style>