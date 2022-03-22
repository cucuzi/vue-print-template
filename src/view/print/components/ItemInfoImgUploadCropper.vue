<template>
  <el-dialog
    title="图片裁剪"
    v-model="open"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="openFunc"
    @opened="openedFunc"
    @close="closeFunc"
  >
    <el-row>
      <el-col :span="24" :sm="12">
        <vue-cropper
          ref="cropper"
          :aspect-ratio="width/height"
          :min-container-width="200"
          :min-container-height="200"
          :src="originBase64"
          preview=".preview"
        />
      </el-col>
      <el-col :span="24" :sm="{span:10,offset:2}">
        <p style="text-align:center;font-size:16px;font-weight:bold">预览</p>
        <div class="preview" :style="previewStyle"/>
        <div style="text-align:center;">
          <el-button
            type="primary"
            plain
            @click="handleClick"
          >确定
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  components: {VueCropper},
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    target: {
      type: String,
      default: null
    },
    temp: {
      type: String,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    width: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      originBase64: null
    }
  },
  computed: {
    open: {
      get () {
        return this.visible
      },
      set (v) {
        this.$emit('update:visible', v)
      }
    },
    targetBase64: {
      get () {
        return this.target
      },
      set (v) {
        this.$emit('update:target', v)
      }
    },
    previewStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  methods: {
    openFunc () {
      this.originBase64 = this.temp
    },
    openedFunc () {
      this.$refs.cropper.replace(this.originBase64)
    },
    closeFunc () {
      this.$refs.cropper.reset()
    },
    handleClick () {
      this.targetBase64 = this.$refs.cropper.getCroppedCanvas({
        width: this.width,
        height: this.height
      }).toDataURL()
      this.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  margin: 0 auto 10px;
  overflow: hidden;
}
</style>
