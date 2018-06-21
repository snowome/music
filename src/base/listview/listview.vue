<template>
    <base-scroll class="listview" :data="data" :probeType="probeType" :listenScroll="listenScroll" ref="listview" @scroll="scroll">
        <ul>
            <li class="list-group" v-for="(group,index) in data" :key="index" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ol>
                    <li class="list-group-item" v-for="item in group.items" :key="item.id" @click="selectItem(item)">
                        <img class="avatar" v-lazy="item.avatar" />
                        <span class="name">{{item.name}}</span>
                    </li>
                </ol>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li class="item" :class="{current: currentIndex===index}" v-for="(item, index) in shortCutList" :key="index" :data-index="index">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="this.fixedTitle" ref="fixed">
            <h3 class="fixed-title">{{fixedTitle}}</h3>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </base-scroll>
</template>

<script type="text/ecmascript-6">
    import BaseScroll from 'base/scroll/scroll.vue'
    import Loading from 'base/loading/loading.vue'
    import {getData} from 'common/js/dom.js'
    import defer from 'lodash/defer.js'

    const ANCHOR_HEIGHT = 18            // 每个字母的高度
    const TITLE_HEIGHT = 30

    export default {
        data() {
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        props: {
            data: {
                type: Array,
                default: null
            }
        },
        computed: {
            shortCutList() {
                return this.data.map((group) => {
                    return group.title.substring(0, 1)
                })
            },
            fixedTitle() {
                if (this.scrollY > 0) {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        created() {
            this.probeType = 3
            this.touch = {}
            this.listenScroll = true
            this.listHeight = []
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item)
            },
            onShortcutTouchStart(e) {
                let anchorIndex = getData(e.target, 'index') * 1
                let firstTouch = e.touches[0].pageY
                this.touch.y1 = firstTouch
                this.touch.auchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e) {
                let firstTouch = e.touches[0].pageY
                this.touch.y2 = firstTouch
                let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
                let anchorIndex = this.touch.auchorIndex + delta
                this._scrollTo(anchorIndex)
            },
            refresh() {
                this.$refs.listview.refresh()
            },
            scroll(posY) {
                this.scrollY = posY
            },
            _scrollTo(index) {
                if (!index && index !== 0) {
                    return
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.data.length - 1) {
                    index = this.data.length - 1
                }
                this.currentIndex = index
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
            },
            _calculateHeight() {
                this.listHeight = []
                const list = this.$refs.listGroup
                let heigt = 0
                this.listHeight.push(heigt)
                for (let i = 0, len = list.length; i < len; i++) {
                    let item = list[i]
                    heigt += item.clientHeight
                    this.listHeight.push(heigt)
                }
            }
        },
        watch: {
            data() {
                defer(() => {
                    this._calculateHeight()
                })
            },
            scrollY(newY) {
                if (newY > 0) {
                    this.currentIndex = 0
                    return
                }
                const listHeight = this.listHeight
                for (let i = 0, len = listHeight.length; i < len - 1; i++) {
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                this.currentIndex = listHeight.length
            },
            diff(newVal) {
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
                if (this.fixedTop === fixedTop) {
                    return
                }
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
            }
        },
        components: {
            BaseScroll,
            Loading
        }
    }
</script>

<style scoped lang="less" type="text/less" rel="stylesheet/less">
    @import "~common/css/variable.less";

    .listview {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: @color-background;
        overflow: hidden;
        .list-group {
            padding-bottom: 30px;
            .list-group-title {
                padding-left: 20px;
                height: 30px;
                line-height: 30px;
                font-size: @font-size-small;
                color: @color-text-l;
                background-color: @color-highlight-background;
            }
            .list-group-item {
                display: flex;
                align-items: center;
                padding: 20px 0 0 30px;
                .avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
                .name {
                    margin-left: 20px;
                    font-size: @font-size-medium;
                    color: @color-text-l;
                }
            }
        }
        .list-shortcut {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            padding: 20px 0;
            width: 20px;
            font-family: Helvetica;
            text-align: center;
            border-radius: 10px;
            z-index: 30;
            .item {
                padding: 3px;
                line-height: 1;
                font-size: @font-size-small;
                color: @color-text-l;
                &.current {
                    color: @color-theme;
                }
            }
        }
        .list-fixed {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            .fixed-title {
                padding-left: 20px;
                height: 30px;
                line-height: 30px;
                font-size: @font-size-small;
                color: @color-text-l;
                background-color: @color-highlight-background;
            }
        }
        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>
