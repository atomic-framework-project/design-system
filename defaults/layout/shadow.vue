<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Shadows</h2>
    <div class="sg-MainContent-description sg-MarkdownArea"><p>Block and text shadows</p></div>
    <div class="sg-DesignSystemItem">
      <div class="sg-MainContent-list--xSmall">
        <div v-for="(value, key) in datas" class="sg-LayoutCard">
          <div class="sg-LayoutCard--block">
            <div class="sg-LayoutCard--block--inner" style="background:#fff" v-bind:style="{'box-shadow':getValueString(value)}"></div>
          </div>
          <div class="sg-LayoutCard--label">{{key}}</div>
          <span class="sg-LayoutCard--value">
            {{getValueString(value)}}
          </span>
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
      getValueString: function(arrayIn) {
        let res = ''
        arrayIn.forEach(x => {res += x + ' ' })
        return res
      }
    }
  }
</script>
