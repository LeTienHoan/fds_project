<template>

  <v-form ref="form" lazy-validation>
    <div :class="stylePicture">
      <img id="imagePreview" class="pic" :src="imgUrl" alt="">
      <div class="pic-overlay">
        <!-- not select
        <a
          @click="showImgChoices = !showImgChoices"
        >
          <i class="fa "
            :class="showImgChoices ? 'fa-times-circle-o' : 'fa-pencil-square-o'"
            aria-hidden="true">
          </i>
        </a>
        -->
        <a v-show="attachFile">
          <i>
            <div class="avatar-edit">
              <input ref="file" type="file" :id="'imageUpload' + id" accept="image/*" />
              <label :for="'imageUpload' + id">
                <i class="fa fa-upload" aria-hidden="true"></i>
              </label>
            </div>
          </i>
        </a>
      </div>
    </div>
    <v-card v-show="showImgChoices" class="m-image-available">
      <v-container
        fluid
        grid-list-md
      >
        <v-layout row wrap>
          <v-flex
            v-for="(card, index) in imgChoices"
            xs3
            :key="index"
            @click="imgChoiced(card)"
          >
            <v-card>
              <v-card-media
                class="white--text"
                height="200px"
                :src="card"
              ></v-card-media>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
const COMPONENT_NAME = 'jx-mobilink-pic-upload'

function readURL (input, callBack) {
  if (input.files && input.files[0]) {
    let reader = new FileReader()
    reader.onload = function (e) {
      callBack(e.target.result)
    }
    reader.readAsDataURL(input.files[0])
  }
}

export default {
  name: COMPONENT_NAME,
  props: {
    id: {
      default: 'jx-mobilink-pic-upload'
    },
    type: {
      default: 'medium'
    },
    circle: {
      default: false
    },
    attachFile: {
      default: true
    },
    srcImg: ''
  },
  watch: {
    srcImg (val) {
      this.imgUrl = val
    }
  },
  computed: {
    stylePicture () {
      return {
        'pic-container': true,
        'pic-small': this.type === 'small',
        'pic-medium': this.type === 'medium',
        'pic-large': this.type === 'large',
        'pic-xl': this.type === 'xl',
        'pic-circle': this.circle
      }
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      this.$emit('fileSelected', vm.imgUrl)
      window.$('#imageUpload' + vm.id).change(function () {
        readURL(this, (url) => {
          vm.imgUrl = url
          vm.$emit('fileUploaded', vm.$refs.file.files[0])
        })
      })
    })
  },
  data () {
    return {
      valid: true,
      imgUrl: this.srcImg,
      imgUrlTemp: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
      imgChoices: [
        'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        'https://cdn.vuetifyjs.com/images/cards/docks.jpg'
      ],
      showImgChoices: false
    }
  },
  methods: {
    reset () {
      // this.imgUrl = this.imgUrlTemp
      // this.$emit('fileSelected', this.imgUrl)
      this.imgUrl = this.srcImg
      this.$refs.form.reset()
    },
    imgChoiced (src) {
      this.imgUrl = src
      // this.showImgChoices = !this.showImgChoices
      this.$emit('fileSelected', src)
    }
  }
}
</script>

<style lang="scss">
.pic-container{
  cursor: pointer;
  overflow: hidden;

  .pic{
    width: 100%;
    height: 100%;
    display: block;
  }
  .pic-overlay{
    background-color: #ccc;
    opacity: 0.5;
    width: 100%;
    height: 100%;
    margin: 0;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    a{
      display: block;
      padding: 10px;
    }
  }
  &:hover .pic-overlay{
    top: -100%;
  }
}

.pic-container.pic-xs{
  width: 50px;
  height: 50px;
  .pic-overlay a{
    padding: 5px;
  }
}

.pic-container.pic-small{
  width: 70px;
  height: 70px;
}

.pic-container.pic-medium{
  width: 150px;
  height: 150px;
  .pic-overlay a i{
    font-size: 20px;
  }
}

.pic-container.pic-large{
  width: 250px;
  height: 250px;
  .pic-overlay a i{
    font-size: 35px;
  }
}


.pic-container.pic-xl{
  width: 350px;
  height: 350px;
  .pic-overlay a i{
    font-size: 45px;
  }
}

.pic-container.pic-circle{
  border-radius: 50%;
}

.avatar-edit {
  input {
    display: none;
    + label {
      display: inline-block;
      cursor: pointer;
    }
  }
}

.m-image-available {
  position: absolute;
  width: 100%;
  z-index: 5;
  margin-top: 3px;
}
</style>