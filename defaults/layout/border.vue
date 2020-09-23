<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Borders</h2>
    <div class="sg-MainContent-description sg-MarkdownArea"><p>Borders</p></div>

    <div class="sg-DesignSystemItem">

        <div class="sg-MainContent-list--xSmall">
          <div class="sg-LayoutCard" v-for="(value, key) in datas">
            <div class="sg-LayoutCard--block">
              <div class="sg-LayoutCard--block--inner sg-LayoutCard--reversed" style="border-style: solid; border-radius: 0" v-bind:style="{'border-width': value+'px'}">
              </div>
            </div>
            <div class="sg-LayoutCard--label">{{key}}</div>
            <span class="sg-LayoutCard--value">{{value}}px</span>
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
    }
}
</script>

<style>
</style>
