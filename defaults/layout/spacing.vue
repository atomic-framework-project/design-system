<template>
    <div class="sg-MainContent-container">
        <h2 class="sg-MainContent-title">Spacing</h2>
        <div class="sg-DesignSystemItem">
          <div v-for="(value, key) in datas">
            <h3>{{key}}</h3>
            <div class="sg-MainContent-list--xSmall">
              <div v-for="(number, name) in value" class="sg-LayoutCard">
                <div class="sg-LayoutCard--block">
                  <div class="sg-LayoutCard--block--inner">
                    <div style="position:absolute;top:0;right:0;left:0;bottom:0;background-color:rgba(255, 255, 255, .75);"></div>
                    <div class="sg-LayoutCard--block--inner" style="border-radius:0;" :style="getSpacing(number)"></div>
                  </div>
                </div>
                <div class="sg-LayoutCard--label">{{name}}</div>
                <span class="sg-LayoutCard--value">{{number}}px</span>
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
      getSpacing: function (px) {
        return "top:"+px+"px;right:"+px+"px;left:"+px+"px;bottom:"+px+"px;"
      }
    },
  }
</script>
