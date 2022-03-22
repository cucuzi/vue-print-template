<template>
  <div class="img-box">
    <el-upload
        action=""
        :limit="1"
        :file-list="fileList"
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        :on-change="handleChangeFile"
    >
      <el-button type="primary">上传</el-button>
    </el-upload>
    <photo-cropper v-model:visible="openCropper" v-model:target="imgBase64" :temp="tempImgBase64" :height="height"
                   :width="width"/>
  </div>
</template>

<script>
import {readFileBase64} from '@/utils'
import PhotoCropper from './ItemInfoImgUploadCropper'

export default {
  components: {PhotoCropper},
  data() {
    return {
      fileList: [],
      imgBase64: null,
      tempImgBase64: null,
      openCropper: false,
      height: null,
      width: null
    }
  },
  watch: {
    imgBase64: {
      handler(value) {
        this.$emit('setImg', value)
      }
    }
  },
  methods: {
    handleChangeFile(file) {
      if (!this.loading) {
        this.loading = true
        readFileBase64(file.raw).then(base64 => {
          this.$emit('getImgRef', result => {
            this.height = result.clientHeight
            this.width = result.clientWidth
            this.tempImgBase64 = base64
            this.openCropper = true
            this.loading = false
          })
        }).catch(() => {
        }).finally(() => {
          this.loading = false
          this.fileList = []
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  display: flex;

  > div:nth-child(n+2) {
    width: 100%;
  }

  > div:first-child {
    margin-right: 10px;

    > * {
      display: block;
    }

    .video {
      object-fit: cover;
      overflow: hidden;
    }
  }

  button {
    margin-left: 0;
    width: 100%;
  }
}

:deep(.el-upload) {
  display: block;
}
</style>
