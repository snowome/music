<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input class="box" type="text" :placeholder="placeholder" v-model="query" ref="query" />
        <i v-show="query" class="icon-dismiss" @click="clear"></i>
    </div>
</template>

<script type="text/ecmascript-6">
    import {debounce} from 'common/js/util.js'

    export default {
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        data() {
            return {
                query: ''
            }
        },
        methods: {
            setQuery(query) {
                this.query = query
            },
            clear() {
                this.query = ''
            },
            blur() {
                this.$refs.query.blur()
            }
        },
        created() {
            this.$watch('query', debounce((newQuery) => {
                this.$emit('query', newQuery)
            }, 200))
        }
    }
</script>

<style scoped type="text/less" lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    .search-box {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        /*padding: 0 6px;*/
        height: 40px;
        background: @color-highlight-background;
        border-radius: 6px;
        box-sizing: border-box;
        .icon-search {
            font-size: 24px;
            color: @color-background;
        }
        .box {
            flex: 1;
            margin: 0 5px;
            line-height: 40px;
            font-size: @font-size-medium;
            color: @color-text;
            background: @color-highlight-background;
            &::placeholder {
                color: @color-text-d;
            }
        }
        .icon-dismiss {
            position: absolute;
            top: 12px;
            right: 20px;
            font-size: 16px;
            color: @color-background;
        }
    }
</style>
