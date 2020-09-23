<template>
    <div class="sg-MainContent-container">
        <h2 class="sg-MainContent-title">Colors</h2>
        <div class="sg-DesignSystemItem">
            <div v-for="(colors, group) in datas" >
                <h3>{{ group }}</h3>
                <div class="sg-MainContent-list--column">
                    <div v-for="(valCol, keyCol) in colors">
                        <div class="sg-Card" v-bind:style="{'background-color': valCol.value}">
                            <div>
                                <span>{{keyCol}}</span><span>{{valCol.value}}</span>
                            </div>
                        </div>
                        <template v-if="valCol.declinaisons">
                            <div v-for="(valDecli, keyDecli) in valCol.declinaisons">
                                <div class="sg-Card" v-bind:style="{'background-color': valDecli}">
                                    <div>
                                        <span>{{keyCol}}-{{keyDecli}}</span><span>{{valDecli}}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
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
