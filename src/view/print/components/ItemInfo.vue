<template>
  <el-form inline label-width="120px" :disabled="loading">
    <el-form-item label="组件名称">
      <el-input ref="name" v-model="item.name"/>
    </el-form-item>
    <el-form-item label="X">
      <el-input v-model="item.left"/>
    </el-form-item>
    <el-form-item label="Y">
      <el-input v-model="item.top"/>
    </el-form-item>
    <el-form-item v-if="item.type===1" key="prefix" label="前缀">
      <el-input v-model="item.prefix"/>
    </el-form-item>
    <el-form-item v-if="item.type===1&&!item.field" key="item-value" label="文本">
      <el-input v-model="item.value"/>
    </el-form-item>
    <el-form-item v-if="item.type===1" key="font-family" label="字体类型">
      <el-select v-model="item.fontFamily">
        <el-option label="微软雅黑" value="Microsoft JhengHei"/>
        <el-option label="宋体" value="SimSun"/>
        <el-option label="黑体" value="SimHei"/>
        <el-option label="楷体" value="KaiTi"/>
        <el-option label="serif" value="serif"/>
        <el-option label="sans-serif" value="sans-serif"/>
        <el-option label="monospace" value="monospace"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===1" key="font-size" label="字体大小">
      <el-select v-model="item.fontSize">
        <el-option v-for="size in fontSize" :key="'fontSize'+size" :label="size" :value="size"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===1" key="font-weight" label="字体粗细">
      <el-select v-model="item.fontWeight">
        <el-option label="正常" value="normal"/>
        <el-option label="加粗" value="bold"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===2" key="img-height" label="高度(mm)">
      <el-input v-model="item.height"/>
    </el-form-item>
    <el-form-item v-if="item.type===2" key="img-width" label="宽度(mm)">
      <el-input v-model="item.width"/>
    </el-form-item>
    <el-form-item v-if="item.type===2&&item.field!==1" key="img-upload" label="上传图片">
      <img-upload @setImg="setImg" @getImgRef="getImgRef"/>
    </el-form-item>
    <el-form-item v-if="item.type===3" key="barcode-text" label="文本">
      <el-input v-model="item.value"/>
    </el-form-item>
    <el-form-item v-if="item.type===3" key="barcode-height" label="条码高度(mm)">
      <el-input v-model="item.height"/>
    </el-form-item>
    <el-form-item v-if="item.type===3" key="barcode-width" label="条码宽度(mm)">
      <el-input v-model="item.width"/>
    </el-form-item>
    <el-form-item v-if="item.type===3" key="with-name" label="显示姓名" style="width:100%">
      <el-checkbox v-model="item.withName" @change="changeWithName"/>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withName" key="name-text-align" label="姓名对齐方式">
      <el-select v-model="item.nameTextAlign">
        <el-option label="左" value="left"/>
        <el-option label="中" value="center"/>
        <el-option label="右" value="right"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withName" key="name-font-family" label="姓名字体类型">
      <el-select v-model="item.nameFontFamily">
        <el-option label="微软雅黑" value="Microsoft JhengHei"/>
        <el-option label="宋体" value="SimSun"/>
        <el-option label="黑体" value="SimHei"/>
        <el-option label="楷体" value="KaiTi"/>
        <el-option label="serif" value="serif"/>
        <el-option label="sans-serif" value="sans-serif"/>
        <el-option label="monospace" value="monospace"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withName" key="name-font-size" label="姓名字体大小">
      <el-select v-model="item.nameFontSize">
        <el-option v-for="size in fontSize" :key="'fontSize'+size" :label="size" :value="size"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withName" key="name-font-weight" label="姓名字体粗细">
      <el-select v-model="item.nameFontWeight">
        <el-option label="正常" value="normal"/>
        <el-option label="加粗" value="bold"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3" key="with-barcode" label="显示条码文本" style="width:100%">
      <el-checkbox v-model="item.withCode" @change="changeWithCode"/>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withCode" key="barcode-text-align" label="条码对其方式">
      <el-select v-model="item.barcodeTextAlign">
        <el-option label="左" value="left"/>
        <el-option label="中" value="center"/>
        <el-option label="右" value="right"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withCode" key="barcode-font-family" label="条码字体类型">
      <el-select v-model="item.barcodeFontFamily">
        <el-option label="微软雅黑" value="Microsoft JhengHei"/>
        <el-option label="宋体" value="SimSun"/>
        <el-option label="黑体" value="SimHei"/>
        <el-option label="楷体" value="KaiTi"/>
        <el-option label="serif" value="serif"/>
        <el-option label="sans-serif" value="sans-serif"/>
        <el-option label="monospace" value="monospace"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withCode" key="barcode-font-size" label="条码字体大小">
      <el-select v-model="item.barcodeFontSize">
        <el-option v-for="size in fontSize" :key="'fontSize'+size" :label="size" :value="size"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="item.type===3&&item.withCode" key="barcode-font-weight" label="条码字体粗细">
      <el-select v-model="item.barcodeFontWeight">
        <el-option label="正常" value="normal"/>
        <el-option label="加粗" value="bold"/>
      </el-select>
    </el-form-item>
    <div style="text-align:center;margin-bottom:10px">
      <el-button type="primary" @click="submitForm">保 存</el-button>
      <el-button type="danger" @click="removeItem">删 除</el-button>
    </div>
  </el-form>
</template>

<script>
import ImgUpload from './ItemInfoImgUpload'

export default {
  components: {ImgUpload},
  props: {
    items: {
      type: Array,
      default: null
    },
    currentIndex: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      item: {}
    }
  },
  computed: {
    fontSize () {
      const fontSize = []
      for (let i = 10; i <= 32; i++) {
        fontSize.push(i)
      }
      return fontSize
    }
  },
  watch: {
    currentIndex: {
      handler (value) {
        if (value != null) {
          // noinspection UnnecessaryLocalVariableJS
          const item = this.items[value]
          this.item = item
        }
      }
    }
  },
  methods: {
    changeWithName (value) {
      if (value) {
        this.item.nameFontFamily = 'Microsoft JhengHei'
        this.item.nameFontSize = '16'
        this.item.nameFontWeight = 'normal'
        this.item.nameTextAlign = 'left'
      }
    },
    changeWithCode (value) {
      if (value) {
        this.item.barcodeFontFamily = 'Microsoft JhengHei'
        this.item.barcodeFontSize = '16'
        this.item.barcodeFontWeight = 'normal'
        this.item.barcodeTextAlign = 'left'
      }
    },
    setImg (src) {
      this.item.value = src
    },
    getImgRef (result) {
      this.$emit('getImgRef', outResult => {
        result(outResult)
      })
    },
    removeItem () {
      this.$emit('removeItem')
    },
    submitForm () {
      this.loading = true
      if (this.item.name == null || this.item.name === '') {
        this.$alert('组件名称不能为空', '警告', {
          confirmButtonText: '确定',
          callback: () => {
            this.$nextTick(() => {
              this.$refs.name.focus()
            })
          }
        })
        this.loading = false
        return
      }
      this.$emit('submitForm', result => {
        result.then(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
