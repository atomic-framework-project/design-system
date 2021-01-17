<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Gradients</h2>
    <div class="sg-DesignSystemItem">
      <template v-for="(types, family) in datas">
        <h3>{{ family }}</h3>
        <div class="sg-MainContent-list--column">
          <template v-for="(properties, name) in types">
            <div
              class="sg-Card"
              v-bind:style="{
                minHeight: '50px',
                height: 'auto',
                backgroundImage: properties.type + '-gradient(' + (properties.type == 'radial' ? 'circle' : 'to right' ) + ', ' + properties.steps.join(', ') + ')',
                backgroundSize: '25% 100%',
                backgroundRepeat: 'no-repeat'
              }">
              <div>
                <span style="flex: 0 0 25%;">{{ name }}</span>
                <span style="flex: 1; width: auto;">{{ properties.variants.join(', ') }}<br>{{ properties.steps.join(', ') }}</span>
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
