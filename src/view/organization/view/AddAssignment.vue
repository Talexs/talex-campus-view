<!--
  - Copyright (c) 2022. TalexDreamSoul
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="AddAssignment-Container LayoutSub-Frame" :class="{ edit: editId }">
    <p class="title force">{{ editId ? "修改" : "创建" }}作业</p>

    <div v-loading="loading" style="margin-top: -10px;">
      <el-tabs class="flat header-filter">
        <el-tab-pane label="属性">
          <el-row>
            <el-col :lg="16" :md="20" :sm="24" :xs="24">
              <el-form :model="assignment" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
                <el-form-item label="名称" prop="title">
                  <el-input v-model="assignment.title" placeholder="请填写作业名称."></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                  <el-radio-group v-model="assignment.type">
                    <el-radio-button label="PERSONAL" />
                    <el-radio-button label="TEAM" />
                    <el-radio-button label="PROJECT" />
                    <el-radio-button label="PRINTED" />
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="提交方式" prop="complete_requirement">
                  <el-radio-group v-model="assignment.complete_requirement">
                    <el-radio-button label="TEXT" />
                    <el-radio-button label="FILE" />
                    <el-radio-button label="MIXED" />
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="editId >= 0" label="额外" prop="complete_extra">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入额外数据"
                    v-model="assignment.complete_extra">
                  </el-input>
                </el-form-item>
                <el-form-item label="简介" prop="desc">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入简介"
                    v-model="assignment.desc">
                  </el-input>
                </el-form-item>
                <el-form-item label="到期时间" prop="deadline">
                  <el-date-picker v-model="assignment.deadline" type="datetime" placeholder="请选择截止时间"
                    :shortcuts="shortcuts" />
                </el-form-item>
                <el-form-item class="submit">
                  <el-button type="primary" @click="submitForm">{{ editId ? "修 改" : "创 建" }}</el-button>
                  <el-button @click="resetForm">重 置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="内容">
          <div class="AddAssignment-Content">
            <el-scrollbar>
              <TalexEditor v-model="assignment.content" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分配" :disabled="!editId">
          <div style="text-align: center">
            <el-transfer v-if="distribution.org?.members" v-model="distribution.model" filterable :titles="['未分配', '已分配']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}',
              }" :props="{
  key: 'member_id',
  label: 'username',
}" :data="distribution.org.members" @change="handleChange">
              <template #default="{ option }">
                <span>{{ option.user.username }} ({{ option.member_id }})</span>
              </template>
            </el-transfer>
          </div>

          <el-button type="primary" style="left: 50%;transform: translate(-50%, 0);margin-top: 2rem;position: relative"
            @click="distributes">分配</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: "AddAssignment"
}
</script>

<script setup>
import { reactive, ref, onMounted, onUpdated, computed, watch, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import { assignmentModel } from '~/plugins/model/assignment/AssignmentModel.ts'
import { MentionTip } from '@plugins/addon/MentionerManager.ts'
import { TipType } from '@plugins/addon/Tipper.ts'

const props = defineProps({
  org_id: {
    type: Number,
    default: 0
  },
  assignment_id: {
    type: Number,
    default: -1
  }
})
const emits = defineEmits(['edit'])

const form = ref()
const loading = ref(false)
const distribution = ref({})
const assignment = reactive({ title: '', type: 'PERSONAL', desc: '', deadline: 0, content: '', complete_requirement: 'MIXED' })

const editId = ref()

const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '明天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '3 天后',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
      return date
    },
  },
  {
    text: '一周后',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    },
  },
  {
    text: '一月后',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
      return date
    },
  },
  {
    text: '一年后',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
      return date
    },
  },
]

async function distributes() {
  const res = await assignmentModel.distribute(editId.value, distribution.value.model)

  // distribution success
  if (res) {

    await getAssignment()

    await window.$tipper.mention(new MentionTip('分配成功!', {
      type: TipType.SUCCESS
    }))

  }

}

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    title: [{ validator: checkInfo, trigger: 'blur', required: true }],
    type: [{ validator: checkInfo, trigger: 'blur', required: true }],
    deadline: [{ validator: checkInfo, trigger: 'blur', required: true }],
    desc: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
}

/**
 * 表单规则验证
 */
const { rules } = getRules()

onMounted(render)
onUpdated(render)

let init = false
function render() {
  if (init) return
  init = true

  editId.value = props.assignment_id === -1 ? null : props.assignment_id
  getAssignment()
}

const types = ['PERSONAL', 'TEAM', 'PROJECT', 'PRINTED']

const getAssignment = async () => {
  if (!editId.value) return
  loading.value = true
  const model = await assignmentModel.info(editId.value)

  Object.assign(assignment, model)

  assignment.type = types[model.type]
  assignment.deadline = new Date(model.createdAt)

  const distributeResult = await assignmentModel.distributeResult(editId.value)

  distribution.value = distributeResult

  distribution.value.model = distributeResult.distributed.map(item => item.receiver_id)

  loading.value = false
}

// 重置表单
const resetForm = () => {
  form.value.resetFields()
}

const submitForm = async formName => {
  if (!assignment.content) {
    await window.$tipper.mention(new MentionTip('请填写任务内容!', {
      type: TipType.ERROR
    }))

    return
  }

  console.log(assignment.deadline)

  form.value.validate(async valid => {
    if (valid) {
      let res = {}
      if (editId.value) {
        res = await assignmentModel.edit(editId.value, {
          ...assignment,
          type: types.indexOf(assignment.type),
          priority: 0
        })
      } else {
        res = await assignmentModel.create({
          ...assignment,
          type: types.indexOf(assignment.type),
          org_id: props.org_id,
          priority: 0
        })
        resetForm(formName)
      }

      if (res) {
        await getAssignment()

        emits('edit', assignment)

        await window.$tipper.mention(new MentionTip(editId.value ? "修改成功!" : "创建成功!", {
          type: TipType.SUCCESS
        }))
      }

    } else {
      console.error('error submit!!')
      ElMessage.error('请将信息填写完整')
    }
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  top: 20px;

}

.AddAssignment-Container:not(.edit) {
  min-width: 1200px;
}

.AddAssignment-Container.edit {
  background: transparent !important;
}

.AddAssignment-Content {

  position: relative;

  height: 440px;

  overflow: hidden;
}
</style>
