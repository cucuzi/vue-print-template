<template>
  <div class="print-container">
    <item-select :disabled="loading" v-model:items="items"/>
    <el-scrollbar v-loading="loading" class="print-el-scrollbar" wrap-class="default-el-scrollbar-wrap" tabindex="-1">
      <print-main ref="print-main" v-model:globe-form="globeForm" v-model:items="items" @setCurrentRow="setCurrentRow"
                  @setCodeLength="setCodeLength"/>
      <iframe id="print-iframe"/>
    </el-scrollbar>
    <el-scrollbar class="print-right" wrap-class="default-el-scrollbar-wrap">
      <div class="print-box">
        <el-tabs v-model="rightTabs" type="card">
          <el-tab-pane :disabled="loading" label="信息提取" name="extract" style="padding-top:15px">
            <info-extract v-model:code-form="codeForm" @handleQuery="handleQuery"/>
            <div style="color:red;margin-bottom:10px;text-align:center;font-weight:bold">提取到个数：{{ codeLength }}</div>
          </el-tab-pane>
          <el-tab-pane :disabled="loading" label="全局设置" name="globe" style="padding-top:15px">
            <el-form inline label-width="120px" :disabled="loading">
              <el-form-item label="纸张高度(mm)">
                <el-input v-model="globeForm.pageHeight"/>
              </el-form-item>
              <el-form-item label="纸张宽度(mm)">
                <el-input v-model="globeForm.pageWidth"/>
              </el-form-item>
              <el-form-item label="纸张上边距(mm)">
                <el-input v-model="globeForm.pagePaddingTop"/>
              </el-form-item>
              <el-form-item label="纸张左边距(mm)">
                <el-input v-model="globeForm.pagePaddingLeft"/>
              </el-form-item>
              <el-form-item label="行数">
                <el-input v-model="globeForm.rows"/>
              </el-form-item>
              <el-form-item label="列数">
                <el-input v-model="globeForm.columns"/>
              </el-form-item>
              <el-form-item label="卡片高度(mm)">
                <el-input v-model="globeForm.height"/>
              </el-form-item>
              <el-form-item label="卡片宽度(mm)">
                <el-input v-model="globeForm.width"/>
              </el-form-item>
              <el-form-item label="卡片上间距(mm)">
                <el-input v-model="globeForm.marginTop"/>
              </el-form-item>
              <el-form-item label="卡片左间距(mm)">
                <el-input v-model="globeForm.marginLeft"/>
              </el-form-item>
              <el-form-item label="边框宽度">
                <el-select v-model="globeForm.borderWidth">
                  <el-option v-for="width in borderWidth" :key="'borderWidth'+width" :label="width" :value="width"/>
                </el-select>
              </el-form-item>
              <div style="text-align:center;margin-bottom:10px">
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button type="info" @click="handlePrint">打印</el-button>
                <el-button type="danger" @click="resetForm">初始化</el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :disabled="loading||currentIndex==null" label="组件设置" name="component" style="padding-top:15px">
            <item-info ref="item-info" :items="items" :current-index="currentIndex" @getImgRef="getImgRef"
                       @removeItem="removeItem" @submitForm="submitItemForm"/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="print-box">
        <el-tabs model-value="items" type="card">
          <el-tab-pane label="组件列表" name="items">
            <el-table ref="items-table" :data="items" highlight-current-row @current-change="handleCurrentChange">
              <el-table-column label="组件名称" prop="name" align="center"/>
              <el-table-column label="组件类型" prop="type" align="center" :formatter="dealType"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import InfoExtract from './components/InfoExtract'
import ItemSelect from './components/ItemSelect'
import ItemInfo from './components/ItemInfo'
import PrintMain from './components/PrintMain'

export default {
  name: 'PrintPage',
  components: {InfoExtract, ItemSelect, ItemInfo, PrintMain},
  data() {
    return {
      loading: false,
      cos: null,
      rightTabs: 'extract',
      currentIndex: null,
      items: [
        {
          name: '个人组织',
          id: 0,
          type: 1,
          field: 1,
          prefix: '组织：',
          isSelect: false,
          left: 150,
          top: 95,
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Microsoft JhengHei'
        },
        {
          name: '个人姓名',
          id: 1,
          type: 1,
          field: 2,
          prefix: '姓名：',
          isSelect: false,
          left: 150,
          top: 55,
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Microsoft JhengHei'
        },
        {
          name: '个人证号',
          id: 2,
          type: 1,
          field: 3,
          prefix: '证号：',
          isSelect: false,
          left: 150,
          top: 75,
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Microsoft JhengHei'
        },
        {
          name: '个人头像',
          id: 3,
          type: 2,
          field: 1,
          isSelect: false,
          left: 30,
          top: 30,
          width: 25,
          height: 35,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#000',
          margin: 0
        },
        {name: '个人条码', id: 4, type: 3, field: 1, isSelect: false, left: 150, top: 115, height: 10, width: 30}
      ],
      globeForm: {
        pageHeight: 297,
        pageWidth: 210,
        pagePaddingTop: 0,
        pagePaddingLeft: 0,
        rows: 5,
        columns: 2,
        height: 52,
        width: 86,
        marginTop: 0,
        marginLeft: 0,
        borderWidth: 1
      },
      codeForm: {
        startCode: '00001',
        endCode: '00031'
      },
      codeLength: 0
    }
  },
  computed: {
    borderWidth() {
      const borderWidth = []
      for (let i = 0; i <= 6; i++) {
        borderWidth.push(i)
      }
      return borderWidth
    }
  },
  created() {
    this.initCos()
    this.resetForm()
  },
  mounted() {
    // TODO 由于打包后会有link, 要在这里加载iframe样式;
    const headElement = document.getElementsByTagName('head')[0]
    const styleArr = headElement.getElementsByTagName('style')
    const linkArr = headElement.getElementsByTagName('link')
    const iframeWindow = document.getElementById('print-iframe').contentWindow
    let html = ''
    for (const style of styleArr) {
      html += style.outerHTML
    }
    for (const link of linkArr) {
      if (link.rel === 'stylesheet') {
        html += link.outerHTML
      }
    }
    iframeWindow.document.head.innerHTML = html
  },
  methods: {
    initCos() {
      // TODO 初始化cos
      // this.cos = new COS({
      //   getAuthorization: (options, callback) => {
      //     getAuthorization().then(response => {
      //       const data = response.data.data
      //       callback({
      //         TmpSecretId: data.credentials && data.credentials.tmpSecretId,
      //         TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
      //         XCosSecurityToken: data.credentials && data.credentials.sessionToken,
      //         ExpiredTime: data.expiredTime
      //       })
      //     })
      //   }
      // })
    },
    setForm(response) {
      const data = response.data.data
      if (data && data.defaultJson) {
        const obj = JSON.parse(data.defaultJson)
        this.items = obj.items
        this.globeForm = obj.globeForm
        this.codeForm = obj.codeForm
      } else {
        this.resetForm()
      }
    },
    uploadPicture() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        // TODO 保存时图片可以传到对象存储
        // const itemIndex = this.items.findIndex(item => item.type === 2 && !item.field)
        // if (itemIndex > -1) {
        //   const item = this.items[itemIndex]
        //   if (item.value == null || item.value === '' || !item.value.startsWith('data:image/')) {
        //     resolve()
        //   } else {
        //     const cosKey = 'xxxx'
        //     const body = base64toBlob(item.value)
        //     this.cos.putObject({
        //       Bucket: '',
        //       Region: '',
        //       Key: cosKey,
        //       StorageClass: 'STANDARD',
        //       Body: body
        //     }, (err, data) => {
        //       if (err === null && data.statusCode === 200) {
        //         this.items[itemIndex].value = 'https://xxx.myqcloud.com/' + cosKey + '?t=' + new Date().getTime()
        //         resolve()
        //       } else {
        //         this.$message.error('图片上传失败，请重试')
        //         reject()
        //       }
        //     })
        //   }
        // } else {
        resolve()
        // }
      })
    },
    submitForm() {
      return new Promise(resolve => {
        this.loading = true
        const items = this.items.filter(item => item.name == null || item.name === '')
        if (items.length > 0) {
          this.$alert('有组件名称为空', '警告', {
            confirmButtonText: '确定',
            callback: () => {
              if (this.rightTabs !== 'component') {
                this.rightTabs = 'component'
              }
              this.currentIndex = this.items.findIndex(item => item.id === items[0].id)
              this.$nextTick(() => {
                this.$refs['item-info'].$refs['name'].focus()
              })
            }
          })
          this.loading = false
        }
        this.uploadPicture().then(() => {
          const obj = {
            items: this.items.map(item => {
              delete item.isSelect
              return item
            }),
            globeForm: this.globeForm,
            codeForm: this.codeForm
          }
          // eslint-disable-next-line no-unused-vars
          const jsonString = {
            jsonString: JSON.stringify(obj)
          }
          // TODO 后台保存当前的所有参数
          // return axois(jsonString).then(() => {
          //   this.$message.success('保存成功')
          //   this.loading = false
          // })
        }).catch(() => {
        }).finally(() => {
          this.loading = false
          resolve()
        })
      })
    },
    submitItemForm(result) {
      result(this.submitForm())
    },
    handlePrint() {
      const ref = this.$refs['print-main']
      if (ref.printInfos.length < 1) {
        this.$message.error('没有需要打印的内容')
        return
      }
      const itemIndex = this.items.findIndex(item => item.isSelect)
      if (itemIndex > -1) {
        this.items[itemIndex].isSelect = false
      }
      this.$nextTick(() => {
        const iframeWindow = document.getElementById('print-iframe').contentWindow
        iframeWindow.document.body.innerHTML = ref.$el.outerHTML
        iframeWindow.print()
      })
    },
    handleQuery(startCode, endCode, result) {
      result(this.$refs['print-main'].handleQuery(startCode, endCode))
    },
    resetItemInfo() {
      this.rightTabs = 'globe'
      this.$refs['items-table'].setCurrentRow()
      this.currentIndex = null
    },
    setCodeLength(length) {
      this.codeLength = length
    },
    setCurrentRow(index) {
      if (index != null) {
        this.$refs['items-table'].setCurrentRow(this.items[index])
        if (this.rightTabs !== 'component') {
          this.rightTabs = 'component'
        }
        this.currentIndex = index
      } else {
        this.resetItemInfo()
      }
    },
    handleCurrentChange(row) {
      if (row) {
        const selectItemIndex = this.items.findIndex(item => item.isSelect)
        if (selectItemIndex > -1) {
          this.items[selectItemIndex].isSelect = false
        }
        const itemIndex = this.items.findIndex(item => item === row)
        row.isSelect = true
        if (this.rightTabs !== 'component') {
          this.rightTabs = 'component'
        }
        this.currentIndex = itemIndex
      } else {
        this.resetItemInfo()
      }
    },
    dealType(row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '文本'
        case 2:
          return '图片'
        case 3:
          return '条码'
        default:
          return ''
      }
    },
    resetForm() {
      this.globeForm = {
        pageHeight: 297,
        pageWidth: 210,
        pagePaddingTop: 0,
        pagePaddingLeft: 0,
        rows: 5,
        columns: 2,
        height: 52,
        width: 86,
        marginTop: 0,
        marginLeft: 0,
        borderWidth: 1
      }
      this.items = [
        {
          name: '个人组织',
          id: 0,
          type: 1,
          field: 1,
          prefix: '组织：',
          isSelect: false,
          left: 150,
          top: 95,
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Microsoft JhengHei'
        },
        {
          name: '个人姓名',
          id: 1,
          type: 1,
          field: 2,
          prefix: '姓名：',
          isSelect: false,
          left: 150,
          top: 55,
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Microsoft JhengHei'
        },
        {
          name: '个人证号',
          id: 2,
          type: 1,
          field: 3,
          prefix: '证号：',
          isSelect: false,
          left: 150,
          top: 75,
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Microsoft JhengHei'
        },
        {
          name: '个人头像',
          id: 3,
          type: 2,
          field: 1,
          isSelect: false,
          left: 30,
          top: 30,
          width: 25,
          height: 35,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#000',
          margin: 0
        },
        {name: '个人条码', id: 4, type: 3, field: 1, isSelect: false, left: 150, top: 115, height: 10, width: 30}
      ]
    },
    removeItem() {
      this.items.splice(this.currentIndex, 1)
    },
    getImgRef(result) {
      const selectItem = this.items.find(item => item.isSelect)
      result(this.$refs['print-main'].$refs[selectItem.name + selectItem.id])
    }
  }
}
</script>
<style lang="scss" scoped>
.print-container {
  display: flex;
  justify-content: center;
  height: 100%;

  > * {
    height: 100%;
  }

  .print-right {
    width: 350px;

    :deep(.default-el-scrollbar-wrap) {
      padding: 15px 10px 0 5px;
    }
  }

  .print-el-scrollbar {
    flex: 1;
    background-color: #E9EEF3;
  }

  :deep(.print-box) {
    margin-bottom: 25px;

    &:last-child {
      border-bottom: none;
    }

    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0;
      }

      .el-tabs__content {
        border-width: 0 1px 1px 1px;
        border-style: solid;
        border-color: #dfe4ed;
        border-radius: 0 0 4px 4px;
      }
    }
  }
}
</style>
