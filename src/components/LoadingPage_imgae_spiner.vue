<template>
  <v-container fluid v-show="loading.state">
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div class="loading-component">
          <div class="holder">
            <div class="spinner">
              <img src="https://images.pexels.com/photos/910310/pexels-photo-910310.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
              <img src="https://images.pexels.com/photos/1003816/pexels-photo-1003816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
              <img src="https://images.pexels.com/photos/1613017/pexels-photo-1613017.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
              <img src="https://images.pexels.com/photos/163235/hot-air-balloon-balloon-sky-hot-air-balloon-ride-163235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
              <img src="https://images.pexels.com/photos/219005/pexels-photo-219005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
            </div>
          </div>
        </div>
        <div class="loading-message-component">
          {{loading.message}}
        </div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    name: 'loading-page',
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      loading () {
        return this.$store.getters['loading/loading']
      }
    }
  }
</script>

<style>
html,
body {
  height: 100%;
}

.loading-message-component{
  padding-top: 50px;
}

.loading-component {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.loading-component:before {
    content: "";
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(255,255,255,0.8);
    display: block;
}

 .holder {
    -webkit-perspective: 1200px;
    -moz-perspective: 1200px;
    -ms-perspective: 1200px;
    perspective: 1200px;
  }
  
.spinner {
 -webkit-animation: spinner 6s linear infinite;
    -o-animation: spinner 6s linear infinite;
    animation: spinner 6s linear infinite;
  
     -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d; 
     
    position: relative;
    width: 360px;
    height: 250px;
  }
  
   .spinner:hover {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
     }
  
   .spinner img {
    position: absolute;
    border: 1px solid #ccc;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
    object-fit: cover;
    width: 100%;
    height: 100%;
    max-height: 100%;
  }
  
  .spinner img:nth-child(1) {
    -webkit-transform: rotateY(-0deg) translateX(180px); /* translateX = spinnerHeight/2 */
    -moz-transform: rotateY(-0deg) translateX(180px);
    -ms-transform: rotateY(-0deg) translateX(180px);
    transform: rotateY(-0deg) translateX(180px);
  }
  
  
  .spinner img:nth-child(2) {
    webkit-transform: rotateY(-72deg) translateX(180px);
    -moz-transform: rotateY(-72deg) translateX(180px);
    -ms-transform: rotateY(-72deg) translateX(180px);
    transform: rotateY(-72deg) translateX(180px);
  }
  
  .spinner img:nth-child(3) {
   -webkit-transform: rotateY(-144deg) translateX(180px);
    -moz-transform: rotateY(-144deg) translateX(180px);
    -ms-transform: rotateY(-144deg) translateX(180px);
     transform: rotateY(-144deg) translateX(180px);
  }
  
  .spinner img:nth-child(4) {
    -webkit-transform: rotateY(-216deg) translateX(180px);
    -moz-transform: rotateY(-216deg) translateX(180px);
    -ms-transform: rotateY(-216deg) translateX(180px);
    transform: rotateY(-216deg) translateX(180px);
  }
  
   .spinner img:nth-child(5) {
    -webkit-transform: rotateY(-288deg) translateX(180px);
    -moz-transform: rotateY(-288deg) translateX(180px);
    -ms-transform: rotateY(-288deg) translateX(180px);
    transform: rotateY(-288deg) translateX(180px);
  }
  
 
  
 @-webkit-keyframes spinner {
    from { -webkit-transform: rotateY(0deg);    }
    to   { -webkit-transform: rotateY(-360deg); }
  }


  @keyframes spinner {
    from {
      -moz-transform: rotateY(0deg);
      -ms-transform: rotateY(0deg);
      transform: rotateY(0deg);
    }
    to {
      -moz-transform: rotateY(-360deg);
      -ms-transform: rotateY(-360deg);
      transform: rotateY(-360deg);
    }
  }

</style>
