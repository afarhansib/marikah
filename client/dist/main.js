const { createApp } = Vue
const socket = io();

const app = createApp({
  data() {
    return {
      criteriaModalOpen: false,
      folderForReference: 0,
      directoryData: []
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
  }
})

app.mount('#app')