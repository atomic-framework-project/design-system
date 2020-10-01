<template>
  <div class="sg-MainContent-container">
    <h2 class="sg-MainContent-title">Typefaces</h2>
    <div class="sg-DesignSystemItem">
      <div v-for="(typeface, key) in datas">
        <h3>{{ typeface.name }}</h3>
        <div class="sg-MainContent-flexbox">
          <div class="sg-ColorCard" v-for="(nameFont, keyFont) in typeface.fonts" >
            <p style="font-size:4em;text-align:center;color:black;opacity:1; " v-bind:style="{
              'font-family': typeface['font-face-family'],
              'font-weight': nameFont['font-weight'],
            }" >
              Aa
            </p>
            <span>{{ nameFont.name }}</span>
          </div>
        </div>
        <h3>{{ typeface.name }} - Configuration</h3>
        <div class="sg-MainContent-flexbox" >
          <div class="sg-Card sg-TypescaleCard" v-for="(params, breakpoint) in typeface.responsive">
            <span>{{ breakpoint }}</span>
            <p class="sg-number">{{ params.root }} <span>Points</span></p><br/>
            <p>{{ params.typescale }} <span>Typescale</span></p><br/>
            <p>{{ params['line-height-heading'] }} <span>Line-height Headings</span></p><br/>
            <p>{{ params['line-height-text'] }} <span>Line-height Texts</span></p>
          </div>
        </div>

        <h3>{{ typeface.name }} - Typescale Overview</h3>
        <div class="sg-Table-Container">
          <table>
            <tr>
              <th></th>
              <th v-for="(params, breakpoint) in typeface.responsive" >{{ breakpoint }}</th>
            </tr>
            <tr v-for="(fontSizeDatas, fontSizeNamespace) in typeface.responsive.mobile['font-sizes']" :class="[(fontSizeNamespace == 'root') ? 'root': '']" >
              <th>{{ fontSizeNamespace }}</th>
              <template v-for="(params, breakpoint) in typeface.responsive">
                <td>
                  <span>{{ typeface.responsive[breakpoint]['font-sizes'][fontSizeNamespace] }}</span>
                </td>
              </template>
            </tr>
          </table>
        </div>
        <div v-for="(nameFont, keyFont) in typeface.fonts">
          <h3>{{ typeface.name }} {{ nameFont.name }} - Typescale (Mobile)</h3>
          <div class="sg-Table-Container">
            <div class="sg-TypescaleDesktop" v-for="(size, name) in typeface.responsive.mobile['font-sizes'] ">
              <p v-bind:style="{
                'font-size': size + 'px',
                'font-family': typeface['font-face-family'],
                'font-weight': nameFont['font-weight'],
              }" >
                The quick brown fox jumps over the lazy dog
              </p>
              <span>{{ size }} - </span>
              <span>{{ name }}</span>
            </div>

          </div>
        </div>

      </div>
    </div></div>
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

  .sg-MainContent-flexbox {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
    margin-bottom: 65px;
  }
  .sg-Card, .sg-ColorCard {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;
    min-height: 215px;
    margin: 16px 8px;
    border-radius: 4px;
  }
  .sg-TypescaleCard {
    border: 1px solid var(--color-grayscale-soft);
    flex-direction: column;
    align-items: center;
  }
</style>
