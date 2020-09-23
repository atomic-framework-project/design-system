<template>
    <div class="sg-MainContent-container">
        <h2 class="sg-MainContent-title">Responsive</h2>
        <div class="sg-DesignSystemItem">
          <div class="sg-MainContent-description sg-MarkdownArea">
            <p>The interface is fully responsive, with {{Object.keys(datas.steps).length - 1}} breakpoints</p>
            <p>Min width is <code>{{getMin}}px</code><br>Max width is <code>{{datas.max}}px</code></p>
          </div>
          <div class="sg-DesignSystemItem">
            <div class="sg-Breakpoints-wrapper">
              <div class="sg-Breakpoints">
                <div class="sg-Breakpoints-item" v-for="(resol, label) in datas.steps">
                  <div class="sg-Breakpoints-item-tooltip">
                    <div class="sg-Breakpoints-item-tooltip-action">
                      <div class="sg-Tooltip-icon">
                        <img :src="img[label]" alt="">
                      </div>
                      <div class="sg-Devices">{{label}}</div>
                    </div>
                  </div>
                  <div class="sg-Breakpoints-item-size">{{resol}}px</div>
                </div>   
              </div>

              <div class="sg-Breakpoints-endsize">
                {{datas.max}}px
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        img: {
          'mobile': './../../assets-sg/img/icon-responsive-mobile.svg',
          'tablet': './../../assets-sg/img/icon-responsive-tablet.svg',
          'desktop': './../../assets-sg/img/icon-responsive-desktop.svg',
          'desktop-large': './../../assets-sg/img/icon-responsive-desktop-large.svg',
        }
      }
    },
    props: {
      datas: {
          type: Object,
          default: () => {
              {}
          }
      }
    },
    computed: {
      getMin: function () {
        const reso = []
        Object.keys(this.datas.steps).forEach(element => {
          reso.push(this.datas.steps[element])    
        }, this);
        reso.sort((a, b) => a - b);
        return reso[0]
      }
    }
  }
  </script>
