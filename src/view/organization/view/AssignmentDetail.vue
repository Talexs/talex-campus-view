<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from 'vue'
import { assignmentModel } from '~/plugins/model/assignment/AssignmentModel'
import AddAssignment from './AddAssignment.vue'
import AssignmentComplement from './AssignmentComplement.vue'
import AssignmentStatus from './AssignmentStatus.vue'
import { useRoute } from 'vue-router'
import { useStore } from '~/plugins/store/index'

const store = useStore()
const route = useRoute()

const activeName = ref('overview')
const props = defineProps<{
  modelValue?: boolean,
}>()

const assignment = ref<any>(null)
const distribution = ref<any>(null)

onMounted(async () => {
  assignment.value = await assignmentModel.info(+route.params.assignment)
  distribution.value = await assignmentModel.distribution(+route.params.assignment)

  console.log(distribution.value)
})

function handleUpdate(newAssignment: any) {
  Object.assign(assignment.value, newAssignment)
}

const hasPer = computed(() => assignment.value?.org && assignment.value?.sender?.id === store.local.user.id)
</script>

<template>
  <div v-if="assignment" class="AssignmentDetail">
    <div class="AssignmentDetail-Header">
      <h1>{{ assignment.title }}</h1>
      <p>{{ assignment.desc }}</p>
      <div class="AssignmentDetail-Header-Addon">
        <span v-if="assignment.type === 0">个人任务</span>
        <span>{{ assignment.deadline }}</span>
        <span>{{ assignment.finished_by || 0 }} 已完成</span>
      </div>

      <div :class="{ finished: distribution?.finished }" class="AssignmentDetail-Header-Offal">
        <span v-if="distribution?.finished">完成</span>
        <span v-else>未交</span>
      </div>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="概述" name="overview">
        <div class="AssignmentDetail-Content" v-html="assignment.content" />
      </el-tab-pane>
      <el-tab-pane label="作业" v-if="!distribution?.finished" name="homeworks">
        <AssignmentComplement :assignment_id="assignment.id" :complete_extra="assignment.complete_extra" />
      </el-tab-pane>
      <el-tab-pane label="作业" v-else name="homeworks">
        您已完成本项作业！
        {{ distribution }}
      </el-tab-pane>
      <el-tab-pane v-if="hasPer" label="编辑" name="edit">
        <AddAssignment @edit="handleUpdate" :assignment_id="assignment.id" :org_id="assignment.org.id" />
      </el-tab-pane>
      <el-tab-pane v-if="hasPer" label="状况" name="status">
        <AssignmentStatus :assignment_id="assignment.id" />
      </el-tab-pane>
    </el-tabs>

  </div>

  <div v-if="assignment" class="AssignmentAside">
    <div class="AssignmentAside-Header">
      <span style="cursor: pointer" @click="$router.back">返回</span>
    </div>

    <div class="AssignmentAside-Sender">
      <UserAvatar :id="assignment.sender.id" />
      {{ assignment.sender.username }}
    </div>
  </div>
</template>

<style lang="scss">
.AssignmentDetail-Header-Offal {
  &.finished {
    background-color: #5acc9b;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 8px #5acc9b, 0 0 0 25px #fff, 0 0 0 27px #8fddbb, 0 0 0 32px #fff, 0 0 0 34px #dbf4ea;
  }

  position: absolute;

  right: 5rem;

  margin: 50px auto;
  width: 46px;
  height: 46px;
  line-height: 45px;
  padding: 25px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  word-break: break-all;
  border-radius: 50%;
  // background-color: #5acc9b;
  // box-shadow: 0 0 0 2px #ffffff, 0 0 0 8px #5acc9b, 0 0 0 25px #fff, 0 0 0 27px #8fddbb, 0 0 0 32px #fff, 0 0 0 34px #dbf4ea;
  background-color: #e43d30;
  box-shadow: 0 0 0 2px #fff,
  0 0 0 8px #e43d30,
  0 0 0 25px #e43d3020,
  0 0 0 27px #e43d30A0,
  0 0 0 32px #e43d3040,
  0 0 0 34px #e43d3050;
  font-size: 23px;
  transform: rotate(-45deg);
}

.AssignmentAside-Header {
  border-bottom: 1px solid var(--el-border-color);
}

.AssignmentAside-Sender {
  display: flex;
  align-items: center;

  margin-top: 1rem;

  .el-avatar {
    margin-right: 0.5rem;
  }

}

.el-tabs {

  .el-tabs__nav-wrap,
  .el-tabs__content {
    padding: 0 4.5%;
  }
}

.AssignmentDetail-Header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    font-weight: 400;
  }

  .AssignmentDetail-Header-Addon {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    margin-top: 1rem;

    span {
      font-size: 0.8rem;
      font-weight: 400;
    }
  }
}

.AssignmentAside {
  position: absolute;
  padding: 1rem;

  width: 12%;

  top: 4rem;
  left: 15%;

  border-radius: 12px;
  box-sizing: border-box;
  background-color: var(--el-fill-color-light);
}

.AssignmentDetail {
  position: relative;
  padding: 1rem;

  top: 4rem;

  width: 55%;
  left: 30%;

  border-radius: 12px;
  box-sizing: border-box;
  background-color: var(--el-fill-color-light);
}
</style>