<template>
  <v-container fluid v-show="loading.state">
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div class="loading-component">
          <div class="cssload-load">
              <div class="cssload-blockcont">
                  <div class="cssload-block"></div>
                  <div class="cssload-block"></div>
                  <div class="cssload-block"></div>

                  <div class="cssload-block"></div>
                  <div class="cssload-block"></div>
                  <div class="cssload-block"></div>

                  <div class="cssload-block"></div>
                  <div class="cssload-block"></div>
                  <div class="cssload-block"></div>

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
        imgLoaderLink: window.themeDisplay ? '/o/mobilink-theme/images/Loading_icon.gif' : 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'
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

 
 

 .cssload-load {
		position:absolute;
		left:calc(50% - 29px);
		width:68px;
		height:68px;
}


.cssload-block {
		position:relative;
		height:19px;
		width:19px;
		display:inline-block;
		background:rgb(255,215,0);
		transition:all 0.24s;
		-o-transition:all 0.24s;
		-ms-transition:all 0.24s;
		-webkit-transition:all 0.24s;
		-moz-transition:all 0.24s;
		animation: cssload-rot 1.5s linear infinite;
		-o-animation: cssload-rot 1.5s linear infinite;
		-ms-animation: cssload-rot 1.5s linear infinite;
		-webkit-animation: cssload-rot 1.5s linear infinite;
		-moz-animation: cssload-rot 1.5s linear infinite;
}
.cssload-block:nth-child(1) {
		animation-delay:0.9s;
		-o-animation-delay:0.9s;
		-ms-animation-delay:0.9s;
		-webkit-animation-delay:0.9s;
		-moz-animation-delay:0.9s;
}
.cssload-block:nth-child(2) {
		animation-delay:0.445s;
		-o-animation-delay:0.445s;
		-ms-animation-delay:0.445s;
		-webkit-animation-delay:0.445s;
		-moz-animation-delay:0.445s;
		animation: cssload-rot 3.6s linear infinite;
		-o-animation: cssload-rot 3.6s linear infinite;
		-ms-animation: cssload-rot 3.6s linear infinite;
		-webkit-animation: cssload-rot 3.6s linear infinite;
		-moz-animation: cssload-rot 3.6s linear infinite;
}
.cssload-block:nth-child(3) {
		animation-delay:0.6s;
		-o-animation-delay:0.6s;
		-ms-animation-delay:0.6s;
		-webkit-animation-delay:0.6s;
		-moz-animation-delay:0.6s;
}
.cssload-block:nth-child(4) {
		animation-delay:0.06s;
		-o-animation-delay:0.06s;
		-ms-animation-delay:0.06s;
		-webkit-animation-delay:0.06s;
		-moz-animation-delay:0.06s;
}
.cssload-block:nth-child(5) {
		animation-delay:1.2s;
		-o-animation-delay:1.2s;
		-ms-animation-delay:1.2s;
		-webkit-animation-delay:1.2s;
		-moz-animation-delay:1.2s;
}
.cssload-block:nth-child(6) {
		animation-delay:0.6s;
		-o-animation-delay:0.6s;
		-ms-animation-delay:0.6s;
		-webkit-animation-delay:0.6s;
		-moz-animation-delay:0.6s;
		animation: cssload-rot 2.1s linear infinite;
		-o-animation: cssload-rot 2.1s linear infinite;
		-ms-animation: cssload-rot 2.1s linear infinite;
		-webkit-animation: cssload-rot 2.1s linear infinite;
		-moz-animation: cssload-rot 2.1s linear infinite;
}
.cssload-block:nth-child(7) {
		animation-delay:0.12s;
		-o-animation-delay:0.12s;
		-ms-animation-delay:0.12s;
		-webkit-animation-delay:0.12s;
		-moz-animation-delay:0.12s;
}
.cssload-block:nth-child(8) {
		animation-delay:0.445s;
		-o-animation-delay:0.445s;
		-ms-animation-delay:0.445s;
		-webkit-animation-delay:0.445s;
		-moz-animation-delay:0.445s;
		animation: cssload-rot 1.8s linear infinite;
		-o-animation: cssload-rot 1.8s linear infinite;
		-ms-animation: cssload-rot 1.8s linear infinite;
		-webkit-animation: cssload-rot 1.8s linear infinite;
		-moz-animation: cssload-rot 1.8s linear infinite;
}
.cssload-block:nth-child(9) {
		animation-delay:7.5s;
		-o-animation-delay:7.5s;
		-ms-animation-delay:7.5s;
		-webkit-animation-delay:7.5s;
		-moz-animation-delay:7.5s;
		animation: cssload-rot 2.4s linear infinite;
		-o-animation: cssload-rot 2.4s linear infinite;
		-ms-animation: cssload-rot 2.4s linear infinite;
		-webkit-animation: cssload-rot 2.4s linear infinite;
		-moz-animation: cssload-rot 2.4s linear infinite;
}


@keyframes cssload-rot {
		0% {
				transform:none;
		}
		20% {
				transform:rotateZ(-90deg) rotateY(180deg);
		}
		40% {
				background:rgb(210,105,30);
				transform:none;
		}
		60% {
				background:rgb(255,255,255);
		}
		80% {
				background:rgb(100,149,237);
		}
		90% {
				transform:none;
				background:rgb(34,34,34);
		}
}

@-o-keyframes cssload-rot {
		0% {
				-o-transform:none;
		}
		20% {
				-o-transform:rotateZ(-90deg) rotateY(180deg);
		}
		40% {
				background:rgb(210,105,30);
				-o-transform:none;
		}
		60% {
				background:rgb(255,255,255);
		}
		80% {
				background:rgb(100,149,237);
		}
		90% {
				-o-transform:none;
				background:rgb(34,34,34);
		}
}

@-ms-keyframes cssload-rot {
		0% {
				-ms-transform:none;
		}
		20% {
				-ms-transform:rotateZ(-90deg) rotateY(180deg);
		}
		40% {
				background:rgb(210,105,30);
				-ms-transform:none;
		}
		60% {
				background:rgb(255,255,255);
		}
		80% {
				background:rgb(100,149,237);
		}
		90% {
				-ms-transform:none;
				background:rgb(34,34,34);
		}
}

@-webkit-keyframes cssload-rot {
		0% {
				-webkit-transform:none;
		}
		20% {
				-webkit-transform:rotateZ(-90deg) rotateY(180deg);
		}
		40% {
				background:rgb(210,105,30);
				-webkit-transform:none;
		}
		60% {
				background:rgb(255,255,255);
		}
		80% {
				background:rgb(100,149,237);
		}
		90% {
				-webkit-transform:none;
				background:rgb(34,34,34);
		}
}

@-moz-keyframes cssload-rot {
		0% {
				-moz-transform:none;
		}
		20% {
				-moz-transform:rotateZ(-90deg) rotateY(180deg);
		}
		40% {
				background:rgb(210,105,30);
				-moz-transform:none;
		}
		60% {
				background:rgb(255,255,255);
		}
		80% {
				background:rgb(100,149,237);
		}
		90% {
				-moz-transform:none;
				background:rgb(34,34,34);
		}
}
</style>
