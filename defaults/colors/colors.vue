<template>
    <div>
        <div v-for="(group, colors) in datas" :key="group">
            <h3>{{ group }}</h3>
            <div class="sg-MainContent-list--column">
                <div v-for="(colorname, color) in colors" :key="colorname">
                    <div class="sg-Card" :style="`background-color:${color.value};`">
                        <div>
                            <span>{{ colorname }}</span><span>{{ color.value }}</span>
                        </div>
                    </div>
                    <div v-if="typeof color.declinaisons === 'object'">
                        <div v-for="(decliname, decli) in colors" :key="color.declinaisons">
                            <div class="sg-Card" :style="`background-color:${decli};`">
                                <div>
                                    <span>{{ decliname }}</span><span>{{ decli }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'colors',
    props: {
      link: {
        type: Object,
        default: {},
      }
    }
  }
</script>
