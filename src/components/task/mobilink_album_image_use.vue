<template>
  <div :id="'album_image_'+id" style="width: 100%;">
      <uploader :options="options" class="uploader-example" v-if="albumProcessing">
        <uploader-unsupport></uploader-unsupport>
        <AlbumFileSRC
          :id="id"
          :class_name="class_name"
          :class_pk="class_pk"
          :group_id="group_id"
          auto="true"
          :album_api="album_api"
          :permission="permission"
        ></AlbumFileSRC>
      </uploader>
      <AlbumFileSRC v-else
          :id="id"
          :class_name="class_name"
          :class_pk="class_pk"
          :group_id="group_id"
          :album_api="album_api"
          :permission="permission"
          @init-album-file-upload="initAlbumFileUpload"
        ></AlbumFileSRC>
  </div>
</template>

<script>
import AlbumFileSRC from './mobilink_album_image'
const COMPONENT_NAME = 'jx-mobilink-album-image-use'

export default {
  name: COMPONENT_NAME,
  props: {
    id: null,
    class_pk: null,
    class_name: null,
    album_api: '',
    options: null,
    permission: {
      default: 'read'
    }
  },
  data () {
    return {
      albumProcessing: false
    }
  },
  components: {
    AlbumFileSRC
  },
  methods: {
    initAlbumFileUpload: function (prevewConfig) {
      this.albumProcessing = true
      this.$emit('init-album-file-upload', prevewConfig)
    }
  },
  destroyed () {
    // delete this.id
    // delete this.class_pk
    // delete this.class_name
    // delete this.album_api
    // delete this.options
    // delete this.permission
    // delete this.albumProcessing
    // delete this.initAlbumFileUpload
  }
}
</script>

<style>

</style>
