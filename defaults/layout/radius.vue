<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Borders radius</h2>
    <div class="sg-DesignSystemItem">
      <div>
        <div class="sg-MainContent-list--xSmall">
          <div class="sg-LayoutCard" v-for="(value, key) in datas">
            <div class="sg-LayoutCard--block" :class="{'display-as-square': (key === 'circle')}" >
              <div v-if="typeof value === 'object'" class="sg-LayoutCard--block--inner" v-bind:style="{'border-radius': value[0]}"></div>
              <div v-else class="sg-LayoutCard--block--inner" v-bind:style="{'border-radius': value+'px'}"></div>
            </div>
            <div class="sg-LayoutCard--label">{{key}}</div>
            <span v-if="typeof value === 'number'" class="sg-LayoutCard--value">{{value}}px</span>
            <span v-else class="sg-LayoutCard--value">{{value[0]}}</span>
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
    }
}
</script>

<style>
</style>
