<script>
import VueBarcode from '@/components/VueBarcode'
import {h} from "vue"

export default {
  props: {
    globeForm: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      printType: 1,
      printInfos: []
    }
  },
  computed: {
    pageGlobeForm: {
      get() {
        return this.globeForm
      },
      set(v) {
        this.$emit('update:globeForm', v)
      }
    },
    pageItems: {
      get() {
        return this.items
      },
      set(v) {
        this.$emit('update:items', v)
      }
    }
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handlePreventDefault)
  },
  unmounted() {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('keydown', this.handlePreventDefault)
  },
  methods: {
    checkFocus() {
      const scrollbar = document.querySelector('.print-el-scrollbar')
      return scrollbar === document.activeElement || scrollbar.contains(document.activeElement)
    },
    handleMove(e, name, id) {
      const items = this.pageItems
      const itemIndex = items.findIndex(item => item.id === id)
      const selectItemIndex = items.findIndex(item => item.isSelect)
      if (selectItemIndex > -1) {
        this.pageItems[selectItemIndex].isSelect = false
      }
      this.pageItems[itemIndex].isSelect = true
      this.$emit('setCurrentRow', itemIndex)
      const ref = this.$refs[name + id]
      const disX = e.clientX - ref.offsetLeft
      const disY = e.clientY - ref.offsetTop
      // TODO 拖动事件需要优化
      document.onmousemove = (e) => {
        const left = e.clientX - disX
        const top = e.clientY - disY
        const parent = ref.parentElement
        if (left > -1 && (left + ref.clientWidth) <= parent.clientWidth && top > -1 && (top + ref.clientHeight) <= parent.clientHeight) {
          const item = this.pageItems[itemIndex]
          item.left = left
          item.top = top
          this.pageItems[itemIndex].left = item.left
          this.pageItems[itemIndex].top = item.top
        }
      }
      document.ondragstart = (ev) => {
        ev.preventDefault()
      }
      document.ondragend = (ev) => {
        ev.preventDefault()
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleQuery(startCode, endCode) {
      return new Promise(resolve => {
        // TODO 从后台请求数据
        // listPrintInfos({startCode, endCode}).then(response => {
        // this.printInfos = response.data.data
        const printInfos = []
        for (let i = 1; i < 32; i++) {
          printInfos.push({
            'code': '0000' + i,
            'name': '张三' + i,
            'photo': null,
            'deptName': '开发部'
          })
        }
        this.printInfos = printInfos
        this.$emit('setCodeLength', this.printInfos.length)
        // }).catch(() => {
        // }).finally(() => {
        resolve()
        // })
      })
    },
    dealPrintInfo(page) {
      const start = page * this.pageGlobeForm.rows * this.pageGlobeForm.columns
      const end = (page + 1) * this.pageGlobeForm.rows * this.pageGlobeForm.columns
      return this.printInfos.slice(start, end)
    },
    handlePreventDefault(e) {
      const itemIndex = this.pageItems.findIndex(item => item.isSelect)
      if (itemIndex > -1 && this.checkFocus()) {
        e.preventDefault()
      }
    },
    handleKeyUp(e) {
      const itemIndex = this.pageItems.findIndex(item => item.isSelect)
      if (itemIndex > -1 && this.checkFocus()) {
        const item = this.pageItems[itemIndex]
        let left, top
        switch (e.code) {
          case 'ArrowLeft':
            left = item.left - 1
            this.pageItems[itemIndex].left = left
            break
          case 'ArrowUp':
            top = item.top - 1
            this.pageItems[itemIndex].top = top
            break
          case 'ArrowRight':
            left = item.left + 1
            this.pageItems[itemIndex].left = left
            break
          case 'ArrowDown':
            top = item.top + 1
            this.pageItems[itemIndex].top = top
            break
          case 'Backspace':
            this.pageItems.splice(itemIndex, 1)
            break
          case 'Delete':
            this.pageItems.splice(itemIndex, 1)
            break
        }
      }
    }
  },
  render() {
    const printPage = []
    let pages
    // 非法字符不渲染
    if (this.pageGlobeForm.rows == null || this.pageGlobeForm.rows === '' || this.pageGlobeForm.rows === 0 ||
        this.pageGlobeForm.columns == null || this.pageGlobeForm.columns === '' || this.pageGlobeForm.columns === 0 ||
        this.printInfos.length === 0) {
      pages = 0
    } else {
      pages = Math.ceil(this.printInfos.length / (this.pageGlobeForm.rows * this.pageGlobeForm.columns))
    }
    // 每页数据
    for (let page = 0; page < pages; page++) {
      const printRow = []
      let printCard = []
      const infos = this.dealPrintInfo(page)
      // 卡片对象
      for (let index = 0; index < infos.length; index++) {
        const info = infos[index]
        const items = []
        // 卡片内部组件
        for (const item of this.pageItems) {
          let node, itemChildrenDate, itemChildrenNode
          const itemData = {
            style: {
              left: item.left + 'px',
              top: item.top + 'px'
            }
          }
          switch (item.type) {
            case 1:
              // 文本
              itemData.style.fontSize = item.fontSize + 'px'
              itemData.style.fontWeight = item.fontWeight
              itemData.style.fontFamily = item.fontFamily
              itemChildrenDate = {}
              itemChildrenNode = []
              if (item.prefix) {
                itemChildrenNode.push(h('span', {
                  style: {
                    whiteSpace: 'pre'
                  },
                  innerText: item.prefix
                }))
              }
              switch (item.field) {
                case 1:
                  // 组织
                  itemChildrenDate.innerText = info.deptName
                  break
                case 2:
                  // 姓名
                  itemChildrenDate.innerText = info.name
                  break
                case 3:
                  // 编号
                  itemChildrenDate.innerText = info.code
                  break
                default:
                  // 默认
                  itemChildrenDate.innerText = item.value
                  break
              }
              itemChildrenNode.push(h('span', itemChildrenDate))
              node = itemChildrenNode
              break
            case 2:
              // 图片
              itemData.style.width = item.width + 'mm'
              itemData.style.height = item.height + 'mm'
              itemData.style.borderWidth = item.borderWidth + 'px'
              itemData.style.borderStyle = 'solid'
              itemData.style.borderColor = '#000'
              itemData.style.margin = 0
              itemChildrenDate = {
                style: {
                  width: '100%',
                  height: '100%'
                }
              }
              if (item.field === 1) {
                itemChildrenDate.src = info.photo
              } else {
                itemChildrenDate.src = item.value || null
              }
              node = h('img', itemChildrenDate)
              break
            case 3:
              // 条码
              itemChildrenNode = []
              if (item.withName) {
                itemChildrenNode.push(h('div', {
                  style: {
                    textAlign: item.nameTextAlign,
                    fontSize: item.nameFontSize + 'px',
                    fontWeight: item.nameFontWeight,
                    fontFamily: item.nameFontFamily
                  },
                  innerText: info.name
                }))
              }
              itemChildrenDate = {
                background: 'transparent',
                displayValue: false,
                margin: 0,
                width: '1',
                elementTag: 'img',
                style: {
                  height: item.height + 'mm',
                  width: item.width + 'mm'
                }
              }
              if (item.field === 1) {
                itemChildrenDate.value = info.code
              } else {
                itemChildrenDate.value = item.value
              }
              itemChildrenNode.push(h(VueBarcode, itemChildrenDate))
              if (item.withCode) {
                itemChildrenNode.push(h('div', {
                  style: {
                    textAlign: item.barcodeTextAlign,
                    fontSize: item.barcodeFontSize + 'px',
                    fontWeight: item.barcodeFontWeight,
                    fontFamily: item.barcodeFontFamily
                  },
                  innerText: info.code
                }))
              }
              node = h('div', null, itemChildrenNode)
              break
          }
          // 第一个卡片处理
          if (page === 0 && index === 0) {
            itemData.ref = item.name + item.id
            const classArr = ['edit-item']
            if (item.isSelect) {
              classArr.push('is-select')
            }
            itemData.class = classArr
            itemData.tabindex = '-1'
            itemData.onMousedown = (event) => {
              event.stopPropagation()
              if (event.button !== 0) {
                return
              }
              this.handleMove(event, item.name, item.id)
            }
          }
          let children
          if (node) {
            if (Array.isArray(node)) {
              children = node
            } else {
              children = [node]
            }
          }
          items.push(h('div', itemData, children))
        }
        const printCardData = {
          style: {
            height: this.pageGlobeForm.height + 'mm',
            width: this.pageGlobeForm.width + 'mm',
            borderWidth: this.pageGlobeForm.borderWidth + 'px',
            borderColor: '#000',
            marginTop: this.pageGlobeForm.marginTop + 'mm',
            marginLeft: this.pageGlobeForm.marginLeft + 'mm'
          }
        }
        const classArr = ['print-card']
        if (page === 0 && index === 0) {
          classArr.push('edit-card')
        } else {
          classArr.push('disabled-card')
        }
        printCardData.class = classArr
        printCard.push(h('div', printCardData, items))
        // 指定次数后强制换行
        if (printCard.length === parseInt(this.pageGlobeForm.columns)) {
          printRow.push(h('div', {
            class: 'print-row'
          }, printCard))
          printCard = []
        }
      }
      // 对多余的卡片进行换行操作
      if (printCard.length > 0) {
        printRow.push(h('div', {
          class: 'print-row'
        }, printCard))
      }
      // 分页符
      printRow.push(h('div', {
        class: 'no-print page-break'
      }))
      // 每页对象
      printPage.push(h('div', {
        class: 'print-page',
        style: {
          height: this.pageGlobeForm.pageHeight + 'mm',
          width: this.pageGlobeForm.pageWidth + 'mm',
          paddingTop: this.pageGlobeForm.pagePaddingTop + 'mm',
          paddingLeft: this.pageGlobeForm.pagePaddingLeft + 'mm'
        }
      }, printRow))
    }
    // 打印的对象
    return h('div', {
      id: 'print-main',
    }, printPage)
  }
}
</script>
