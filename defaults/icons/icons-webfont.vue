<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Icons (Webfont)</h2>
    <div class="sg-MainContent-description sg-MarkdownArea"><p>Icons to be extended by SCSS placeholder, rendered as an icon webfont</p></div>

    <div class="sg-DesignSystemItem">
       <div class="sg-MainContent-list--small" >
         
            <div class="sg-Card sg-IconCard" v-for="(icon, name) in datas" >
              <template v-if="name !== 'webfont'">
                <div>
                  <svg v-html="icon._path" :width="icon.width" :height="icon.height"></svg>
                </div>
                <span>{{ name }}</span>
                <span class="sg-LayoutCard--value">{{ icon.width }}px-{{ icon.height }}px</span>
              </template>
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