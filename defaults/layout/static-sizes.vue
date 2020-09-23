<template>
    <div class="sg-MainContent-container">
      <h2 class="sg-MainContent-title">Static Sizes</h2>
        <div class="sg-DesignSystemItem">
          <div v-for="(value, key) in datas">
            <h3>{{key}}</h3>
            <div class="sg-MainContent-list--xSmall">
              <div v-for="(obj, name) in value" class="sg-LayoutCard">
                <div class="sg-LayoutCard--label">
                  {{name}}
                  <span v-for="(nr, label) in obj"  class="sg-LayoutCard--value">{{label}} - {{nr}}px</span>
                </div>
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
