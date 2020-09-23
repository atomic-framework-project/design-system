<template>
    <div class="sg-MainContent-container">
        <h2 class="sg-MainContent-title">Easing</h2>
        <div class="sg-DesignSystemItem">
           <div class="sg-MainContent-list--xSmall">
            <div class="sg-LayoutCard" v-for="(val, key) in datas" >
              <div class="sg-LayoutCard--block display-as-square hover_special_easing_accelerate">
                <div class="sg-LayoutCard--block--inner" style="border-radius:50%;transform:none;" :style="getTransition(val.css[0])">
                </div>
              </div>
              <div class="sg-LayoutCard--label">
                {{val.js}}
                <span class="sg-LayoutCard--value">{{val.css[0]}}</span>
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
      // transition:all 500ms cubic-bezier(0.895, 0.03, 0.685, 0.22);
      getTransition: function (tr) {
        return "transition:all 500ms " + tr
      }

    },
  }
</script>

<style>
  .hover_special_easing_accelerate:hover > div{transform:translateY(-20px) !important;}
</style>
