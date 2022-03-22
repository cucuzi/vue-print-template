<template>
  <div class="print-left">
    <div class="print-box">
      <div class="print-title">基础组件</div>
      <div class="print-button-box">
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreateText">文本</el-button>
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreateImg">图片</el-button>
      </div>
    </div>
    <div class="print-box">
      <div class="print-title">特殊组件</div>
      <div class="print-button-box">
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreateDept">个人组织</el-button>
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreateName">个人姓名</el-button>
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreateCode">个人编号</el-button>
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreatePhoto">个人头像</el-button>
        <el-button :disabled="disabled||loading" type="primary" size="default" @click="handleCreateBarcode">条码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import printIdGenerate from '@/mixins/printIdGenerate'

export default {
  mixins: [printIdGenerate],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    pageItems: {
      get() {
        return this.items
      },
      set(v) {
        this.$emit('update:items', v)
      }
    }
  },
  methods: {
    handleCreateText() {
      this.loading = true
      let name = '文本'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = {
        name: name,
        type: 1,
        prefix: '',
        value: '文本',
        isSelect: false,
        left: 0,
        top: 0,
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Microsoft JhengHei'
      }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    },
    handleCreateImg() {
      this.loading = true
      let name = '图片'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = {
        name: name,
        type: 2,
        prefix: '',
        value: '',
        isSelect: false,
        left: 0,
        top: 0,
        width: 20,
        height: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        margin: 0
      }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    },
    handleCreateBarcode() {
      this.loading = true
      let name = '条码'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = { name: name, type: 3, value: 'test', isSelect: false, left: 0, top: 0, height: 10, width: 30 }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    },
    handleCreateDept() {
      this.loading = true
      let name = '个人组织'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = {
        name: name,
        type: 1,
        field: 1,
        prefix: '',
        isSelect: false,
        left: 0,
        top: 0,
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Microsoft JhengHei'
      }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    },
    handleCreateName() {
      this.loading = true
      let name = '个人姓名'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = {
        name: name,
        type: 1,
        field: 2,
        prefix: '姓名：',
        isSelect: false,
        left: 0,
        top: 0,
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Microsoft JhengHei'
      }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    },
    handleCreateCode() {
      this.loading = true
      let name = '个人编号'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = {
        name: name,
        type: 1,
        field: 3,
        prefix: '证号：',
        isSelect: false,
        left: 0,
        top: 0,
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Microsoft JhengHei'
      }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    },
    handleCreatePhoto() {
      this.loading = true
      let name = '个人头像'
      let item = this.pageItems.find(item => item.name === name)
      if (item) {
        let index = 0
        while (item) {
          ++index
          item = this.pageItems.find(item => item.name === name + index)
        }
        name += index
      }
      item = {
        name: name,
        type: 2,
        field: 1,
        isSelect: false,
        left: 0,
        top: 0,
        width: 25,
        height: 35,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        margin: 0
      }
      item.id = this.generateId()
      this.pageItems.push(item)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.print-left {
  width: 200px;
  padding: 15px 0;

  .print-box {
    text-align: center;
  }

  .print-title {
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 5px;
  }

  .print-button-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    :deep(.el-button) {
      padding: 0;
      font-size: 16px;
      height: 28px;
      width: 100px;

      & + .el-button {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }
}
</style>
