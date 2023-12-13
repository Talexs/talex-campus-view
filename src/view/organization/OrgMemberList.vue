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
  <div>
    <el-table :data="list" stripe row-class-name="OrgMemberList-list">
      <el-table-column prop="avatar" label="用户">
        <template #header>
          <FlatInput v-model="searchState"></FlatInput>
        </template>
        <template #default="scope">
          <div class="user">
            <img v-if="scope.row?.user?.avatar" :src="scope.row?.user?.avatar" alt="" />
            <img v-else :src="Avatar" class="corner" alt="" />
            <p class="username">
              {{ scope.row.user.username }}
              <span style="opacity: .75">({{ scope.row.user.id }})</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="成员状态">
        <template #default="scope">
          <div>
            <el-tag type="success" v-if="scope.row.status === 0">
              正式成员
            </el-tag>
            <el-popover v-else-if="scope.row.status === 1" placement="right" :width="200">
              <template #reference>
                <el-tag type="warning">
                  等待接受邀请
                </el-tag>
              </template>
              <el-button type="warning" plain>取消邀请</el-button>
            </el-popover>
            <el-tag type="warning" v-else-if="scope.row.status === 2">
              已拒绝邀请
            </el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">
              该用户账号不可用
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="成员权限">
        <template #default="scope">
          <!--            <span v-if="scope.row.permission === 3">超级管理员</span>-->
          <span v-if="scope.row.permission === 2">超管成员</span>
          <span v-else-if="scope.row.permission === 1">管理成员</span>
          <span v-else>团队成员</span>
          <!--            <span v-if="scope.row.permission < 0">黑名单</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="加入时间">
        <template #default="scope">
          {{ formatDateDistance(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="275">
        <template #header>
          <!--          <talex-drop-down hover-trigger>-->
          <!--            <template #display>-->
          <!--              <el-button :icon="Plus" text plain class="rounder-btn primary stretch-center" size="small" type="primary">添加成员</el-button>-->
          <!--            </template>-->
          <!--            <user-searcher />-->
          <!--            <el-button type="primary">添加成员</el-button>-->
          <!--          </talex-drop-down>-->
          <el-button v-if="admin" @click="addMembers = true" :icon="Plus" text plain class="rounder-btn primary stretch-center"
            size="small" type="primary">
            添加成员
          </el-button>
          <span v-else>操作</span>
        </template>
        <template #default="scope">
          <el-button plain size="small" type="primary">编辑</el-button>
          <!-- scope.row.permission === 0 -->
          <el-button plain size="small" type="danger" :disabled="scope.row.user.id === props.owner_id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <TalexCoverDialog v-model="addMembers" to="body">
      <div class="AddMembers">
        <el-tabs class="flat header-filter">
          <el-tab-pane label="搜索">
            <div class="AddMembers-UserSearcher">
              <user-list-searcher @select="handleSearcherSelected" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="批量导入">
            <OrgBatchImports :org_id="org_id" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </TalexCoverDialog>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { formatDateDistance } from '~/plugins/addon/utils'

import Avatar from '~/assets/static/avatar.png'
import OrgBatchImports from './OrgBatchImports.vue'

const emits = defineEmits(['select'])
const props = defineProps({
  members: {
    type: Array
  },
  org_id: {
    type: Number
  },
  owner_id: {
    type: Number
  },
  admin: {
    type: Boolean
  }
})

const list = ref([])
const addMembers = ref(false)
const searchState = ref('')

watch(() => searchState.value, value => {
  if (!value || !value.trim()) return

  handleSearched()
})

watchEffect(() => {
  if (!props.members) return

  handleSearched()
})

function handleSearched() {
  const value = searchState.value.trim()

  list.value = props.members.filter(item => {
    return item.user.username.includes(value) || (JSON.stringify(item.user).includes(value) && value.length > 1)
  })
}

function handleSearcherSelected(item) {
  emits('select', item)
}

</script>

<style lang="scss" scoped>
.AddMembers {

  .el-tabs,
  :deep(.el-tabs__content),
  :deep(.el-tab-pane) {
    position: relative;

    width: 100%;
    height: 100%;

    // overflow: hidden;
  }


  :deep(.AddMembers-UserSearcher) {
    position: relative;
    padding: 1rem;

    width: 100%;
    height: 100%;

    box-sizing: border-box;
  }

  position: relative;
  display: flex;
  padding: 2rem;

  width: 1200px;
  height: 100%;

  overflow: hidden;
  box-sizing: border-box;
}

.OrgMemberList-list {
  .user {
    position: relative;
    display: flex;

    top: 10px;
  }

  img {
    margin-bottom: 5px;
    width: 48px;
    height: 48px;
  }

  .username {
    position: relative;
    padding: 2px 8px;
    display: flex;

    top: 50%;
    left: 5px;

    height: 30px;
    line-height: 45px;
    width: max-content;

    font-size: 17px;
    text-align: center;
    transform: translateY(-50%);
  }
}

.MemberList-Wrapper {
  position: relative;
  padding: 1% 2%;

  background-color: red;
}

.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      //color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
