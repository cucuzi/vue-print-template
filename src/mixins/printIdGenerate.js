export default {
  methods: {
    generateId() {
      const ids = this.pageItems.map(item => item.id).sort((a, b) => a.id - b.id)
      for (let i = 0; i <= ids[this.pageItems.length - 1] + 1; i++) {
        if (ids.indexOf(i) === -1) {
          return i
        }
      }
    }
  }
}
