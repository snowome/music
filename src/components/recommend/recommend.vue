<template>
    <div class="recommend" ref="recommend">
        <base-scroll class="recommend-content" :data="discList" ref="theScroll">
            <div>
                <div class="slider-wrapper" v-if="recommends.length > 0">
                    <swiper :options="swiperOption">
                        <swiper-slide v-for="item in recommends" :key="item.id">
                            <a :href="item.linkUrl">
                                <!--
                                class="needsclick" 是为了解决假如 fastclick拦截click，造成不能点击的问题。
                                注：这里是不需要class="needsclick"的，加上只是为了演示。
                                fastclick监听 img 的点击事件，发现class有 needsclick类，就会认为你需要click，不会拦截click，就不会阻止链接的点击
                                -->
                                <img class="slider-img needsclick" :src="item.picUrl" @load="loadImage" />
                            </a>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li class="item needsclick" v-for="item in discList" :key="item.dissid" @click="selectItem(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl" />
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc">{{item.dissname}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container">
                <base-loading :title="'加载中...'" v-show="!discList.length"></base-loading>
            </div>
        </base-scroll>
        <router-view></router-view>
    </div>
</template>
<script type="text/ecmascript-6">
    import BaseLoading from 'base/loading/loading.vue'
    import BaseScroll from 'base/scroll/scroll.vue'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {getRecommend, getDiscList} from 'api/recommend.js'
    import {ERR_OK} from 'api/config.js'
    import {playListMixin} from 'common/js/mixin.js'
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playListMixin],
        data() {
            return {
                recommends: [],
                discList: [],
                swiperOption: {
                    loop: true,
                    autoplay: 2000,
                    setWrapperSize: true,
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    mousewheelControl: false,
                    observeParents: true
                }
            }
        },
        created() {
            this._getRecommend()
            this._getDiscList()
        },
        methods: {
            handlePlayList(playList) {
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.recommend.style.bottom = bottom
                this.$refs.theScroll.refresh()
            },
            selectItem(item) {
                this.$router.push({
                    path: `/recommend/${item.dissid}`
                })
                this.setDisc(item)
            },
            _getRecommend() {
                getRecommend().then((res) => {
                    if (res.code === ERR_OK) {
                        this.recommends = res.data.slider
                    }
                })
            },
            _getDiscList() {
                getDiscList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.discList = res.data.list
                    }
                })
            },
            loadImage() {
                if (!this.checkLoaded) {
                    this.$refs.theScroll.refresh()
                    this.checkLoaded = true
                }
            },
            ...mapMutations({
                setDisc: 'SET_DISC'
            })
        },
        components: {
            BaseLoading,
            swiper,
            swiperSlide,
            BaseScroll
        }
    }
</script>

<style scoped lang="less" type="text/less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~./swiper.css";
    .recommend {
        position: fixed;
        top: 88px;
        left: 0;
        bottom: 0;
        width: 100%;
    }
    .recommend-content {
        height: 100%;
        overflow: hidden;
    }
    .slider-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
        .slider-img {
            width: 100%;
        }
    }
    .recommend-list {
        .list-title {
            height: 65px;
            line-height: 65px;
            font-size: @font-size-medium;
            color: @color-theme;
            text-align: center;
        }
        .item {
            display: flex;
            align-items: center;
            padding: 0 20px 20px 20px;
            box-sizing: border-box;
            .icon {
                flex: 0 0 60px;
                padding-right: 20px;
                width: 60px;
            }
            .text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                line-height: 20px;
                font-size: @font-size-medium;
                overflow: hidden;
                .name {
                    margin-bottom: 10px;
                    color: @color-text;
                }
                .desc {
                    color: @color-text-d;
                }
            }
        }
    }
    .loading-container {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
    }
</style>

