<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Icons (CSS embed)</h2>
    <div class="sg-MainContent-description sg-MarkdownArea"><p>Icons to be extended by SASS placeholder, leading to a dataUrl encode in the dist CSS file</p></div>

    <div class="sg-DesignSystemItem">
      <div class="sg-MainContent-list--small" >
          <div class="sg-Card sg-IconCard" v-for="(icon, name) in datas">
            <div>
              <img :src="icon._path" :alt="icon.filename" :width="icon.width" :height="icon.height"/>
            </div>
            <span>{{ name }}</span>
            <span class="sg-LayoutCard--value">{{ icon.width }}px-{{ icon.height }}px</span>
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