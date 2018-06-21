<template>
    <div class="music-list">
        <div class="back" @click="back"><i class="icon-back"></i></div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <base-scroll class="list" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" :bounce="bounce" @scroll="scroll" ref="list">
            <div class="song-list-wrapper">
                <song-list :rank="rank" :songs="songs" @select="selectItem"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </base-scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import BaseScroll from 'base/scroll/scroll.vue'
    import SongList from 'base/song-list/song-list.vue'
    import Loading from 'base/loading/loading.vue'
    import {prefixStyle} from 'common/js/dom.js'
    import {mapActions} from 'vuex'
    import {playListMixin} from 'common/js/mixin.js'

    const RESERVED_HEIGHT = 40
    const transform = prefixStyle('transform')
    const backdrop = prefixStyle('backdrop-filter')

    export default {
        mixins: [playListMixin],
        props: {
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default() {
                    return []
                }
            },
            title: {
                type: String,
                default: ''
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                scrollY: 0
            }
        },
        computed: {
            bgStyle() {
                return `background-image: url(${this.bgImage})`
            }
        },
        created() {
            this.probeType = 3
            this.listenScroll = true
            this.bounce = true
        },
        mounted() {
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods: {
            handlePlayList(playList) {
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.list.$el.style.bottom = bottom
                this.$refs.list.refresh()
            },
            scroll(pos) {
                this.scrollY = pos
            },
            back() {
                this.$router.back()
            },
            selectItem(item, index) {
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            random() {
                this.randomPlay({
                    list: this.songs
                })
            },
            ...mapActions([
                'selectPlay',            //  vuex用法：这个 selectPlay 对应 src/stoe/actions.js 里的 export const selectPlay
                'randomPlay'
            ])
        },
        watch: {
            scrollY(newY) {
                let translateY = Math.max(this.minTranslateY, newY)
                let zIndex = 0
                let scale = 1
                let blur = 0
                this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
                const percent = Math.abs(newY) / this.imageHeight
                if (newY > 0) {
                    scale = 1 + percent
                    zIndex = 10
                } else {
                    blur = Math.min(20 * percent, 20)
                }
                this.$refs.filter.style[backdrop] = `blur(${blur}px)`  // IOS上才有的模糊效果
                if (newY < this.minTranslateY) {
                    zIndex = 10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                    this.$refs.playBtn.style.display = 'none'
                } else {
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = 'block'
                }
                this.$refs.bgImage.style.zIndex = zIndex
                this.$refs.bgImage.style[transform] = `scale(${scale})`
            }
        },
        components: {
            BaseScroll,
            SongList,
            Loading
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";

    .music-list {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: @color-background;
        z-index: 100;
        .back {
            position: absolute;
            left: 6px;
            top: 0;
            z-index: 50;
            .icon-back {
                display: block;
                padding: 10px;
                font-size: @font-size-large-x;
                color: @color-theme;
            }
        }
        .title {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            line-height: 40px;
            font-size: @font-size-large;
            color: @color-text;
            text-align: center;
            .text-ellipsis();
            z-index: 40;
        }
        .bg-image {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 70%;
            background-size: cover;
            transform-origin: top;
            .play-wrapper {
                position: absolute;
                bottom: 20px;
                width: 100%;
                z-index: 50;
                .play {
                    margin: 0 auto;
                    padding: 7px 0;
                    width: 135px;
                    font-size: 0;
                    color: @color-theme;
                    text-align: center;
                    border: 1px solid @color-theme;
                    border-radius: 100px;
                    box-sizing: border-box;
                    .icon-play {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 6px;
                        font-size: @font-size-medium-x;
                    }
                    .text {
                        display: inline-block;
                        vertical-align: middle;
                        font-size: @font-size-small;
                    }
                }
            }
            .filter {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(7, 17, 27, .4);
            }
        }
        .bg-layer {
            position: relative;
            height: 100%;
            background-color: @color-background;
        }
        .list {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: @color-background;
            /*overflow: hidden;*/
            .song-list-wrapper {
                padding: 20px 30px;
            }
            .loading-container {
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
</style>
