<script>
export default {
  name: 'OrgBatchImports',
}
</script>

<script setup>
import { ref, watch } from 'vue'
import { organizationModel } from '~/plugins/model/org/OrganizationModel.ts'
import { genAutoIncreaseRef } from '~/plugins/Common.ts'

const props = defineProps(['org_id'])
const value = ref([])
const list = ref([])

watch(() => value.value, value => {
  if (!value) return list.value = []

  list.value = []

  value.split('\n').forEach(item => {
    if (!item || item.trim().length < 1) return
    const [id, username] = item.replace(/\s+/g, ' ').split(' ')

    // if id not number or username not string
    if (isNaN(id) || typeof username !== 'string') return

    let pass = (id + "").padStart(6, '0')

    console.log(pass, pass.substring(pass.length - 6))

    list.value.push({ user_id: id, username, userpass: pass.substring(pass.length - 6) })
  })
})

const [progress, start] = genAutoIncreaseRef()

function batchImports() {

  const cancel = start()

  organizationModel.batchImports(props.org_id, list.value)

  const reset = cancel()

  setTimeout(() => {
    reset()
  }, 3000);
}
</script>

<template>
  <div class="OrgBatchImports">
    <el-scrollbar>
      <div class="OrgBatchImports-Main">

        <p>在下面粘贴内容，列表会自动生成！</p>
        <div class="OrgBatchImports-Content">
          <el-input class="OrgBatchImports-Inputs" style="opacity: .5" :rows="20" v-model="value" type="textarea" />
          <div class="OrgBatchImports-Results">
            <el-table :data="list" v-loading="!list.length">
              <el-table-column prop="user_id" label="编号"></el-table-column>
              <el-table-column prop="username" label="名称"></el-table-column>
              <el-table-column v-if="false" label="操作" :fixed="`right`" width="275">
                <template v-slot="scope">
                  <!--            <el-button plain size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>-->
                  <el-button plain size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div :style="`--p: ${progress * 100}%`" class="OrgBatchImports-Footer">
          <span>共计 {{ list.length }} 条数据</span>
          <FlatButton @click="batchImports" style="margin-bottom: 1.5rem">
            <span v-if="progress > 0">
              {{ Math.round(progress * 10000) / 100 }}%</span>
            <span v-else>确认导入</span>
          </FlatButton>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss">
.OrgBatchImports-Main {
  padding-right: 1rem;
  padding-bottom: 1rem;
}

.OrgBatchImports-Footer {
  &:before {
    content: "";
    z-index: -1;
    position: absolute;

    left: 0;
    bottom: 0;

    width: var(--p, 0%);
    height: 100%;

    opacity: .35;
    transition: width .25s cubic-bezier(0.075, 0.82, 0.165, 1);
    background-color: var(--el-color-success);
  }

  position: sticky;
  padding: 1rem 0rem;
  display: flex;

  align-items: center;
  justify-content: space-between;

  bottom: 0;

  width: 100%;
  height: 4rem;

  text-indent: 1rem;
  box-sizing: border-box;
  backdrop-filter: blur(18px) saturate(180%);
  background-color: #060606A0;
}

.OrgBatchImports {
  position: relative;


  height: 100%;
}

.OrgBatchImports-Content {
  position: relative;
  display: flex;

  gap: 1rem;

  .OrgBatchImports-Results {
    position: relative;
    height: max-content;

    width: 50%;

    opacity: .5;
    background-color: var(--el-border-color-lighter) !important;
  }

  .el-table {
    .el-table__inner-wrapper::before {
      display: none;
    }
  }
}
</style>