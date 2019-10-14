<template>
  <v-dialog v-model="dialogList" persistent :max-width="dialogWidth">
    <v-card>
      <v-card-title v-if="show_dialog_header">
        <slot name="header"></slot>
        <v-spacer></v-spacer>
        <div class="menu" style="display: inline-block;">
          <div class="menu__activator">
            <v-btn icon slot="activator" @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <div v-if="show_button">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="primary" :key="indexs"
            v-for="(items, indexs) in item"
            v-if="items.edit"
            @click.stop="saveDialog(items)"
          >
            <v-icon class="mr-2">{{ items.icon }}</v-icon>  
            {{ items.label }}
          </v-btn>
          <v-btn
            class="primary"
            @click.stop="closeDialog"
          >
            <v-icon class="mr-2">close</v-icon>  
            Đóng
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  const COMPONENT_NAME = 'dia-log'
  export default {
    name: COMPONENT_NAME,
    props: {
      item: {
        type: Array,
        default: () => []
      },
      show_button: {
        type: Boolean,
        default: true
      },
      show_dialog_header: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        dialogList: this.item.model,
        dialogWidth: this.item.width
      }
    },
    created () {
      this.$nextTick(function () {
      })
    },
    watch: {
      item (array) {
        let val = array[0]
        this.dialogList = val.model
        this.dialogWidth = val.width
      }
    },
    methods: {
      closeDialog () {
        this.$emit('closeDialog', false)
      },
      saveDialog (item) {
        this.$emit(item.action)
      }
    }
  }
</script>

<style lang="scss" scoped>

.card__title {
  padding: 0px 16px;
}
.card__text {
  position: inherit
}
</style>
