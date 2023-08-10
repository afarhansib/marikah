const { createApp } = Vue
const socket = io();

const app = createApp({
  data() {
    return {
      criteriaModalOpen: false,
      folderForReference: 0,
      directoryData: [],
      includedItems: [],
      editMarks:[],
      passMarks:[]
    }
  },

  created() {
    socket.on('directoryUpdate', directory => {
      let sourceChildren = directory['children']
      directory['children'] = sourceChildren.sort((a, b) => {
        let theA = Number((a?.name?.split('.'))[0])
        let theB = Number((b?.name?.split('.'))[0])

        return theA - theB
      })
      this.directoryData = directory
      console.log(this.directoryData)
    })
  },

  computed: {
    referencedFiles() {
      let r
      if('children' in this.directoryData) { 
        r = this.directoryData?.children[this.folderForReference]?.children 
      } else {
        r = []
      }
      return r
    },
    includedReferencedItems() {
      return this.referencedFiles.filter(a=>this.includedItems.includes(a.name))
    }
  },

  watch: {
    folderForReference: {
      handler(){
        if('children' in this.directoryData) { 
          this.updateIncludedItems()
        } else {
          this.includedItems = []
        }
        // console.log(this.includedItems)
      },
      immediate: true
    },
    directoryData(n, o) {
      if(!('name' in o)) {
        this.updateIncludedItems()
      }
    }
  },

  methods: {
    updateIncludedItems() {
      this.includedItems = this.directoryData?.children[this.folderForReference]?.children.map(a=>a.name)
    },
    isEqualWithRef(e) {
      // console.log(e)
      let eIncluded = (e.filter(c=>this.includedItems.includes(c.name))).length === this.includedItems.length
      let eMinusRef = (e.filter(a=>!(this.referencedFiles.map(b=>b.name)).includes(a.name))).length === 0
      // console.log(eMinusRef)
      // console.log(eIncluded)
      let result = eIncluded && eMinusRef
      // console.log(result)
      // console.log((e.filter(a=>(e.filter(c=>this.includedItems.includes(c.name))).some(b=>b.name!==a.name))))
      // console.log((e.filter(a=>this.includedItems.includes(a.name))))
      // console.log((e.filter(a=>this.includedItems.includes(a.name))).filter(a=>!this.includedItems.includes(a.name)))
      // return (e.filter(a=>(e.filter(c=>this.includedItems.includes(c.name))).some(b=>b.name===a.name))).length ? false : true
      // return (e.filter(a=>!this.includedItems.includes(a.name))).length ? false : true
      return result
    },
    toggleEditMark(id) {
      if(this.editMarks.includes(id)) {
        this.editMarks = this.editMarks.filter(e=>e!==id)
      } else {
        this.editMarks.push(id)
      }
      // console.log(this.editMarks)
    },
    togglePassMark(id) {
      if(this.passMarks.includes(id)) {
        this.passMarks = this.passMarks.filter(e=>e!==id)
      } else {
        this.passMarks.push(id)
      }
    }
  }
})

app.mount('#app')