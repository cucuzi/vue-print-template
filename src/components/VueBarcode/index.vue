<script>
import {h, watch} from "vue"
import * as JsBarcode from "jsbarcode"
import {deepClone} from "@/utils";

export default {
  name: 'VueBarcode',
  props: {
    value: [String, Number],
    format: [String],
    width: [String, Number],
    height: [String, Number],
    displayValue: {
      type: [String, Boolean],
      default: true
    },
    text: [String, Number],
    fontOptions: [String],
    font: [String],
    textAlign: [String],
    textPosition: [String],
    textMargin: [String, Number],
    fontSize: [String, Number],
    background: [String],
    lineColor: [String],
    margin: [String, Number],
    marginTop: [String, Number],
    marginBottom: [String, Number],
    marginLeft: [String, Number],
    marginRight: [String, Number],
    flat: [Boolean],
    ean128: [String, Boolean],
    elementTag: {
      type: String,
      default: 'svg',
      validator: (value) => {
        return ['canvas', 'svg', 'img'].indexOf(value) !== -1
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { value, ...prop } = this.$props
      const settings = deepClone(prop, true)
      JsBarcode(this.$el.querySelector('.vue-barcode-element'), String(value), settings)
    }
  },
  setup(props) {
    watch(props, () => {
      if (this.$el) {
        this.init()
      }
    })
  },
  render() {
    return h('div', [
      h(this.elementTag, {
        'class': ['vue-barcode-element']
      }),
      h('div', {
      }, this.$slots.default),
    ])
  }
}
</script>
