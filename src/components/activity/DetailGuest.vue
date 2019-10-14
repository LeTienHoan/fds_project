<template>
  <!-- Main content -->
  <v-app id="inspire">
    <main>
      <section class="content">
        <div class="fullwidth" >
          <Detail/>
        </div>
      </section>
    </main>
  </v-app>
  <!-- /.content -->

</template>

<script>
import Detail from './Detail'
export default {
  components: {
    Detail
  }
}
</script>
