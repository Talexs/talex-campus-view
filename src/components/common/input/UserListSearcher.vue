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
  <div class="UserListSearcher">
    <FlatInput v-model="state" @blur="querySearchAsync" @keyup.enter="querySearchAsync" />
  </div>
  <el-table :data="results" v-loading="loading">
    <el-table-column label="头像">
      <template v-slot="scope">
        <user-avatar style="position: relative;top: .25rem" :id="scope.row.id" />
        <span style="top: -.125rem;left: .5rem;position: relative">{{  scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="名称">
      <template v-slot="scope">
        <span class="username">{{ scope.row.username }}</span>
        <span v-if="scope.row?.email" class="email">({{ scope.row.email }})</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" :fixed="`right`" width="275">
      <template v-slot="scope">
        <el-button plain size="small" type="success" @click="handleSelect(scope.row)">邀请</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "UserSearcher"
}
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { userModel } from '~/plugins/model/base/user'
import UserAvatar from '~/components/common/avatar/UserAvatar.vue'

const emits = defineEmits(['select'])
const state = ref('')
const results = ref([])

function handleSelect(item) {
  emits('select', item)
}

async function querySearchAsync() {
  const query = state.value
  if (!query) return

  results.value = await userModel.search(query)
}
</script>

<style lang="scss" scoped>
.UserSearcher-Row {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 40px;

  .username {
    margin-left: 10px;
    font-size: 14px;
    color: var(--el-color-primary);
  }

  .email {
    margin-left: 10px;
    font-size: 12px;
    color: var(--el-color-secondary);
    opacity: .65;
  }
}
</style>
