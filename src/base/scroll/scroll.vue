<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    import IScroll from 'node_modules/iscroll/build/iscroll-probe.js'
    import defer from 'lodash/defer.js'

    export default {
        props: {
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            bounce: {
                type: Boolean,
                default: false
            },
            data: {
                type: Array,
                default: null
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
            pullup: {
                type: Boolean,
                default: false
            },
            beforeScroll: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            defer(() => {
                this._initScroll()
            })
        },
        methods: {
            _initScroll() {
                if (!this.$refs.wrapper) {
                    return
                }
                this.myScroll = new IScroll(this.$refs.wrapper, {
                    disablePointer: true,               // 这三项不加的话，会在谷歌浏览器测试时特别卡
                    disableTouch: false,                // 这三项不加的话，会在谷歌浏览器测试时特别卡
                    disableMouse: false,                // 这三项不加的话，会在谷歌浏览器测试时特别卡
                    momentum: true,                     // 惯性
//                    preventDefault: false,            // 加上的话，在微信浏览器上拉的时候卡
                    bounce: this.bounce,                // 顶部和底部弹回
                    probeType: this.probeType,
                    click: this.click                   // 否则pc端浏览器上事件无效
                })
                if (this.listenScroll) {
                    let _this = this
                    this.myScroll.on('scroll', function () {
                        _this.$emit('scroll', this.y)
                    })
                }
                if (this.pullup) {
                    this.myScroll.on('scrollEnd', () => {
                        if (this.myScroll.y <= this.myScroll.maxScrollY + 50) {
                            this.$emit('scrollToEnd')
                        }
                    })
                }
                if (this.beforeScroll) {
                    this.myScroll.on('beforeScrollStart', () => {
                        this.$emit('beforeScroll')
                    })
                }
            },
//            enable() {
//                this.myScroll && this.myScroll.enable()
//            },
//            disable() {
//                this.myScroll && this.myScroll.disable()
//            },
            refresh() {
                this.myScroll && this.myScroll.refresh()
            },
            scrollTo() {
                this.myScroll && this.myScroll.scrollTo.apply(this.myScroll, arguments)
            },
            scrollToElement() {
                this.myScroll && this.myScroll.scrollToElement.apply(this.myScroll, arguments)
            }
        },
        watch: {
            data() {
                defer(() => {
                    this._initScroll()
                })
            }
        }
    }
</script>

<style scoped lang="less" type="text/less" rel="stylesheet/less"></style>
