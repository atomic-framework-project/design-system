<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Grids</h2>
    <div class="sg-MainContent-description sg-MarkdownArea"><p>grid system</p></div>
    <div class="sg-DesignSystemItem">
      
      
      <div v-for="(config, breakpoint) in datas" class="sg-DesignSystemItem" style="margin-bottom: 45px">
        <h3>Grid {{breakpoint}}</h3>
        <p>{{config.size}} columns - {{config.gutter}}px gutter</p>
        <div class="sg-Grid sg-GridLargeGutter">
          
          <div v-for="(combinaison, index) in config.prefferedCombinaisons " style="width:100%;display:grid;align-content:space-around;justify-content:space-between;" v-bind:style="getGridStyle(config)">
            <div  v-for="(val, j) in getLoopArray(combinaisonLoop(config.size, combinaison))" 
                  class="sg-GridItem" :style="{'grid-column': (((j) * combinaison) +1) + ' / ' + (((j+1) * combinaison) +1) }">{{val}}
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
    },
  methods: {
     getGridStyle: function (cfg) {
      let res = {}
        if(typeof cfg.gutter !== 'undefined' ) {
          res = { 'grid-column-gap' : `${cfg.gutter}px`,
                'grid-template-columns': `repeat(${cfg.size}, calc(${ cfg.relativeSize }% - ${ cfg.gutter }px)` }
        }
        return res
      },
      combinaisonLoop: function (size, combi) {
        return size / combi
      },
      getLoopArray: function (length) {
        let tmp = new Array(length)
        return tmp.fill(' ')
      }
  }
}
</script>

<style>
</style>
