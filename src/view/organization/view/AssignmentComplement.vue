<script setup lang="ts">
import { computed, ref } from 'vue';
import { TipType } from '~/plugins/addon/Tipper'
import FlatButton from '~/components/common/btn/FlatButton.vue';
import GlobalConfig from '~/config/GlobalConfig';
import RefreshConfig from '~/config/RefreshConfig';
import { UploadFile } from 'element-plus';
import { assignmentModel } from '~/plugins/model/assignment/AssignmentModel'
// import { useRouter } from 'vue-router';

const props = defineProps<{
  assignment_id: number,
  complete_extra: string,
}>()

// const router = useRouter()
const extraObj = computed(() => JSON.parse(props.complete_extra || '{}'))
const submitNum = computed(() => extraObj.value['requirements']?.num || 1)

const files = ref<any[]>([])
const completeObj = ref({
  uploading: false,
  percent: 0,
  attachments: [],
  contents: ''
})

const headers = computed(() => {
  const accessToken = localStorage.getItem(RefreshConfig.storage.accessToken)

  return {
    'Authorization': accessToken
  }
})

async function submit() {
  completeObj.value.uploading = true

  // 将所有文件提交然后拿到链接
  const attachmentList = []

  // 判断每一项文件是否都有 response code 200
  for (const file of files.value) {

    if (file['response']?.code !== 200) {
      window.$tipper.tip('文件上传失败！', {
        stay: 2000,
        type: TipType.ERROR
      })

      completeObj.value.uploading = false
      return
    }

    attachmentList.push(file['response'].data.paths[0])
  }

  // TODO: 先忽略文本提交

  // 提交
  const res: any = await assignmentModel.complete(props.assignment_id, completeObj.value.contents, completeObj.value.attachments)

  if (!res) {
    window.$tipper.tip('提交失败！', {
      stay: 2000,
      type: TipType.ERROR
    })

  } else {

    window.$tipper.tip('提交成功！', {
      stay: 2000,
      type: TipType.SUCCESS
    })

    location.reload()

  }

  completeObj.value.uploading = false
}

const action = computed(() => {
  return `//${GlobalConfig.hostName}:${GlobalConfig.endsPort}/file/upload`
})

const sizeStr = computed(() => {
  const maxSize = extraObj.value['requirements']?.size || { num: 128, unit: 'KB' }
  return `${maxSize.num} ${maxSize.unit.toUpperCase()}`
})

const typeStr = computed(() => {
  const suffixList = extraObj.value['requirements']?.type || []

  // 每一个都转大写
  suffixList.forEach((suffix: any, index: number) => {
    suffixList[index] = suffix.toUpperCase()
  })

  return suffixList.join('/')
})

function validateFile(file: any) {
  // ends with check
  const suffixList = extraObj.value['requirements']?.type || []

  if (!suffixList.some((suffix: any) => file.name.toUpperCase().endsWith(suffix))) {
    return false
  }

  // TODO: application/pdf => raw.type

  // 判断大小
  const maxSize = extraObj.value['requirements']?.size || { num: 128, unit: 'KB' }
  const size = file.size / 1024

  console.log(file, size, maxSize.num)

  return size <= maxSize.num
}

async function handleChange(obj: any, fileList: any) {

  for (const file of fileList) {
    if (!validateFile(file)) {
      window.$tipper.tip('文件格式不正确！', {
        stay: 2000,
        type: TipType.ERROR
      })

      // 从列表中删除
      const index = fileList.indexOf(file)

      if (index > -1) {
        fileList.splice(index, 1)
      }

      return
    }

  }
}

function handleUploadSuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFile[]) {
  console.log(response, uploadFile, uploadFiles)
}

function handleUploadError(response: any, uploadFile: UploadFile, uploadFiles: UploadFile[]) {
  console.log('error', response, uploadFile, uploadFiles)
}
</script>

<template>
  <div>
    <p class="CompleteTitle">任务要求提交文件，以PDF格式。在下面提交你的作业！</p>

    <div v-loading="completeObj.uploading" class="CompleteExtra-Submit">
      <div class="CompleteExtra-Submit-File">
        <el-upload class="upload-demo" :headers="headers" :action="action" :file-list="files" drag
          :on-success="handleUploadSuccess" :on-error="handleUploadError" :multiple="submitNum > 1"
          :on-change="handleChange" :limit="submitNum" :auto-upload="!false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传{{ typeStr }}文件，且不超过 {{ sizeStr }}</div>
        </el-upload>
      </div>
    </div>

    <FlatButton :loadingFlag="completeObj.uploading" @click="submit" class="CompleteFinish">
      提交
    </FlatButton>
  </div>
</template>

<style lang="scss">
.CompleteTitle {
  font-weight: 600;
  margin-bottom: 1rem;

  text-align: center;
}

.CompleteFinish {
  margin-top: 1rem;

  float: right;

}
</style>