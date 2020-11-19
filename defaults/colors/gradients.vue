<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Gradients</h2>
    <div class="sg-DesignSystemItem">
      <template v-for="(types, family) in datas">
        <h3>{{ family }}</h3>
        <div class="sg-MainContent-list--column">
          <template v-for="(colors, name) in types">
            <div class="sg-Card" v-bind:style="{height: '50px', 'background-image': 'linear-gradient(to right, '+ colors.join(',') +')', 'background-size': '25% 100%'}">
              <div>
                <span>{{ name }}</span>
              </div>
            </div>
          </template>
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
