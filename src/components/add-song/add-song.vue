<template>
    <transition name="slide">
        <div class="add-song " v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide"><i class="icon-close"></i></div>
            </div>
            <div class="search-box-wrapper">
                <search-box placeholder="搜索歌曲" @query="onQueryChange"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
                <div class="list-wrapper">
                    <base-scroll class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory"></song-list>
                        </div>
                    </base-scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" :showSinger="showSinger" @select="saveSearchHistory(query)" @listScroll="blurInput"></suggest>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box.vue'
    import Suggest from 'components/suggest/suggest.vue'
    import {searchMix} from 'common/js/mixin.js'
    import Switches from 'base/switches/switches.vue'
    import BaseScroll from 'base/scroll/scroll.vue'
    import {mapGetters} from 'vuex'
    import SongList from 'base/song-list/song-list.vue'

    export default {
        mixins: [searchMix],
        data() {
            return {
                showFlag: false,
                showSinger: false,
                currentIndex: 0,
                switches: [
                    { name: '最近播放' },
                    { name: '搜索历史' }
                ]
            }
        },
        computed: {
            ...mapGetters([
                'playHistory'
            ])
        },
        methods: {
            show() {
                this.showFlag = true
            },
            hide() {
                this.showFlag = false
            },
            switchItem(index) {
                this.currentIndex = index
            }
        },
        components: {
            SearchBox,
            Suggest,
            Switches,
            BaseScroll,
            SongList
        }
    }
</script>

<style scoped type="text/less" lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";
    .add-song {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 200;
        background-color: @color-background;
        &.slide-enter-active, &.slide-leave-active { transition: all .3s; }
        &.slide-enter, &.slide-leave-to { transform: translate3d(100%, 0, 0); }
        .header {
            position: relative;
            height: 44px;
            text-align: center;
            .title {
                line-height: 44px;
                font-size: @font-size-large;
                color: @color-text;
            }
            .close {
                position: absolute;
                top: 0;
                right: 8px;
                .icon-close {
                    display: block;
                    padding: 12px;
                    font-size: 20px;
                    color: @color-theme;
                }
            }
        }
        .search-box-wrapper { margin: 20px; }
        .shortcut {
            .list-wrapper {
                position: absolute;
                top: 165px;
                bottom: 0;
                width: 100%;
                .list-scroll {
                    height: 100%;
                    overflow: hidden;
                    .list-inner { padding: 20px 30px; }
                }
            }
        }
        .search-result {
            position: fixed;
            top: 124px;
            bottom: 0;
            width: 100%;
        }
        .tip-title {
            padding: 18px 0;
            font-size: 0;
            text-align: center;
            .icon-ok {
                margin-right: 4px;
                font-size: @font-size-medium;
                color: @color-theme;
            }
            .text {
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
    }
</style>
