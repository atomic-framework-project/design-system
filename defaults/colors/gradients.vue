<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Gradients</h2>
    <div class="sg-DesignSystemItem">
      <template v-for="(colors, family) in datas">
        <div class="sg-MainContent-list--column">
          <div class="sg-Card" v-bind:style="{height: '50px', 'background-image': 'linear-gradient(to right, ' + (colors.join(',')) + ')', 'background-size': '25% 100%'}">
            <div>
              <span>{{ family }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default: () => {
        {
        }
      }
    }
  }
}
</script>
