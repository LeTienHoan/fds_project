<template>
  <div class="uploader">
    <slot :files="files" :file-list="fileList" :started="started">
      <uploader-unsupport></uploader-unsupport>
      <div class="file-drap-upload hidden-xs-only">
        <v-icon>cloud_upload</v-icon> Hoặc kéo thả để tải lên
      </div>
      <uploader-drop>
        <v-icon class="hidden-sm-and-up file-drap-upload-block">cloud_upload</v-icon>
        <uploader-btn :attrs="{'accept': MSystemConfiguration.configuration.fileattach.fileextensions}">Chọn tệp tin</uploader-btn>
      </uploader-drop>
      <!--<uploader-list></uploader-list>-->
    </slot>
  </div>
</template>

<script>
  import Uploader from 'simple-uploader.js'
  import { kebabCase } from '@/assets/js_common/utils'
  import UploaderBtn from './btn.vue'
  import UploaderDrop from './drop.vue'
  import UploaderUnsupport from './unsupport.vue'
  import UploaderList from './list.vue'
  import UploaderFiles from './files.vue'
  import UploaderFile from './file.vue'

  const COMPONENT_NAME = 'uploader'

  export default {
    name: COMPONENT_NAME,
    props: {
      options: {
        type: Object,
        default () {
          return {
            fileMaxSize: 100 * 1024 * 1024
          }
        }
      },
      autoStart: {
        type: Boolean,
        default: true
      },
      pause_start: false
    },
    data () {
      return {
        started: false,
        files: [],
        fileList: [],
        uploader: null,
        _autoStart: this.autoStart
      }
    },
    methods: {
      setfileList (data) {
        this.fileList = data
        // fileList = data xxx
      },
      uploadStart () {
        if (this.pause_start === true) {
          console.log(1)
          this._autoStart = false
          this.started = false
        } else {
          console.log(111)
          this._autoStart = true
          this.started = true
        }
      },
      fileAdded (file) {
        if (file.ignored) {
          return false
        }
        if (file.size > this.options.fileMaxSize) {
          window.showMessageToastr('error', 'File vượt quá dung lượng cho phép')
          return false
        }
        if (this.options.fileType && (this.options.fileType !== 'NONE') && (this.options.fileType.indexOf(file.fileType) < 0)) {
          window.showMessageToastr('error', 'File tải lên không đúng định dạng cho phép')
          return false
        }
      },
      fileRemoved (file) {
        this.files = this.uploader.files
        this.fileList = this.uploader.fileList
      },
      filesSubmitted (files, fileList) {
        this.files = this.uploader.files
        this.fileList = this.uploader.fileList
        console.log(this.pause_start)
        if (!this.pause_start) {
          this.uploader.upload()
        }
      },
      allEvent (...args) {
        args[0] = kebabCase(args[0])
        this.$emit.apply(this, args)
      },
      myCustomUpload: function () {
        this.uploader.upload()
      }
    },
    created () {
      let uploader = new Uploader(this.options)
      this.uploader = uploader
      this.uploader.on('catchAll', this.allEvent)
      this.uploader.on('uploadStart', this.uploadStart)
      this.uploader.on('fileAdded', this.fileAdded)
      this.uploader.on('fileRemoved', this.fileRemoved)
      this.uploader.on('filesSubmitted', this.filesSubmitted)
    },
    destroyed () {
      const uploader = this.uploader
      uploader.off('catchAll', this.allEvent)
      uploader.off('uploadStart', this.uploadStart)
      uploader.off('fileAdded', this.fileAdded)
      uploader.off('fileRemoved', this.fileRemoved)
      uploader.off('filesSubmitted', this.filesSubmitted)
      this.uploader = null
    },
    components: {
      UploaderBtn,
      UploaderDrop,
      UploaderUnsupport,
      UploaderList,
      UploaderFiles,
      UploaderFile
    }
  }
</script>

<style>
  .uploader {
    position: relative;
    margin: 6px 0px;
  }
  .file-drap-upload{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: .5;
    text-align: center;
    vertical-align: bottom;
    top: 15px;
  }
  .file-drap-upload .icon{
    margin-top: -10px;
    font-size: 35px;
  }
  .file-drap-upload-block{
    display: block;
    text-align: center;
    font-size: 35px;
    opacity: 0.5;
    margin-bottom: 10px;
  }
</style>
