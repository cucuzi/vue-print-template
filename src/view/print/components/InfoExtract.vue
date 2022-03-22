<template>
  <el-form inline label-width="120px" :disabled="loading">
    <el-form-item label="起始编号">
      <el-input ref="start-code" v-model="pageCodeForm.startCode" @keyup.enter="handleKeyUpStartCode" />
    </el-form-item>
    <el-form-item label="终止编号">
      <el-input ref="end-code" v-model="pageCodeForm.endCode" @keyup.enter="handleKeyUpEndCode" />
    </el-form-item>
    <div style="text-align:center;margin-bottom:10px">
      <el-button type="primary" :disabled="loading" @click="handleKeyUpEndCode">提 取</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    codeForm: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    pageCodeForm: {
      get () {
        return this.codeForm
      },
      set (v) {
        this.$emit('update:codeForm', v)
      }
    }
  },
  mounted () {
    this.handleQuery()
  },
  methods: {
    handleKeyUpStartCode () {
      this.$nextTick(() => {
        this.$refs['end-code'].focus()
      })
    },
    handleKeyUpEndCode () {
      this.loading = true
      if (this.pageCodeForm.startCode) {
        const startCode = this.pageCodeForm.startCode + ''
        if (startCode.trim().length < 1) {
          this.$alert('起始编号不能为空', '警告', {
            confirmButtonText: '确定',
            callback: () => {
              this.loading = false
            }
          })
          return
        }
        this.pageCodeForm.startCode = startCode
      } else {
        this.$alert('起始编号不能为空', '警告', {
          confirmButtonText: '确定',
          callback: () => {
            this.loading = false
          }
        })
        return
      }
      if (this.pageCodeForm.endCode) {
        const endCode = this.pageCodeForm.endCode + ''
        if (endCode.trim().length < 1) {
          this.$alert('终止编号不能为空', '警告', {
            confirmButtonText: '确定',
            callback: () => {
              this.loading = false
              this.$nextTick(() => {
                this.$refs['end-code'].focus()
              })
            }
          })
          return
        }
        this.pageCodeForm.endCode = endCode
      } else {
        this.$alert('起始编号不能为空', '警告', {
          confirmButtonText: '确定',
          callback: () => {
            this.loading = false
            this.$nextTick(() => {
              this.$refs['start-code'].focus()
            })
          }
        })
        return
      }
      if (this.pageCodeForm.startCode.length !== this.pageCodeForm.endCode.length) {
        this.$alert('起始编号和终止编号长度必须相同', '警告', {
          confirmButtonText: '确定',
          callback: () => {
            this.loading = false
          }
        })
        return
      }
      this.$emit('handleQueryReader', this.pageCodeForm.startCode, this.pageCodeForm.endCode, result => {
        result.then(() => {
          this.loading = false
        })
      })
    },
    handleQuery () {
      this.loading = true
      if (this.pageCodeForm.startCode) {
        const startCode = this.pageCodeForm.startCode + ''
        if (startCode.trim().length < 1) {
          this.loading = false
          return
        }
        this.pageCodeForm.startCode = startCode
      } else {
        this.loading = false
        return
      }
      if (this.pageCodeForm.endCode) {
        const endCode = this.pageCodeForm.endCode + ''
        if (endCode.trim().length < 1) {
          this.loading = false
          return
        }
        this.pageCodeForm.endCode = endCode
      } else {
        this.loading = false
        return
      }
      if (this.pageCodeForm.startCode.length !== this.pageCodeForm.endCode.length) {
        this.loading = false
        return
      }
      this.$emit('handleQuery', this.pageCodeForm.startCode, this.pageCodeForm.endCode, result => {
        result.then(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
