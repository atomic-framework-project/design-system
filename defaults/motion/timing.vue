<template>
    <div class="sg-MainContent-container">
        <h2 class="sg-MainContent-title">Timing</h2>
        <div class="sg-DesignSystemItem">
           <div class="sg-MainContent-list--xSmall">
            <div class="sg-LayoutCard" v-for="(val, key) in datas" >
              <div class="sg-LayoutCard--block display-as-square hover_special_timing_std">
                <div class="sg-LayoutCard--block--inner" style="border-radius:50%;" :style="getTransition(val)" >
                </div>
              </div>
              <div class="sg-LayoutCard--label">
                {{key}}
                <span class="sg-LayoutCard--value">{{val}}</span>
              </div>
            </div>
           </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      datas: {
          type: Object,
          default: () => {
              {}
          }
      }
    },
    methods: {
      getTransition: function (tr) {
        return `transition: all ${tr}ms`
        }
    }
  }
</script>

<style>
  .hover_special_timing_std:hover > div{transform:translateY(-20px) !important;}
</style>
