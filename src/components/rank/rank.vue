<template>
    <div class="rank" ref="rank">
        <base-scroll class="toplist" :data="topList" ref="topList">
            <ul>
                <li class="item needsclick" v-for="item in topList" @click="selectItem(item)">
                    <div class="icon">
                        <img v-lazy="item.picUrl" width="100" height="100"/>
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song, index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}} - {{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <base-loading></base-loading>
            </div>
        </base-scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getTopList} from 'api/rank.js'
    import {ERR_OK} from 'api/config.js'
    import BaseScroll from 'base/scroll/scroll.vue'
    import BaseLoading from 'base/loading/loading.vue'
    import {playListMixin} from 'common/js/mixin.js'
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playListMixin],
        created() {
            this._getTopList()
        },
        data() {
            return {
                topList: []
            }
        },
        methods: {
            _getTopList() {
                getTopList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.topList = res.data.topList
                        // console.log(res.data.topList)
                    }
                })
            },
            selectItem(item) {
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setTopList(item)
            },
            handlePlayList(playList) {
                const bottom = playList.length ? '60px' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.topList.refresh()
            },
            ...mapMutations({
                setTopList: 'SET_TOP_LIST'
            })
        },
        components: {
            BaseScroll,
            BaseLoading
        }
    }
</script>

<style scoped lang="less" type="text/less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";
    .rank {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        .toplist {
            height: 100%;
            overflow: hidden;
            .item {
                display: flex;
                margin: 0 20px;
                padding-top: 20px;
                height: 100px;
                &:last-child { padding-bottom: 20px; }
                .icon {
                    flex: 0 0 100px;
                    width: 100px;
                    height: 100px;
                }
                .songlist {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 20px;
                    height: 100px;
                    font-size: @font-size-small;
                    color: @color-text-d;
                    background: @color-highlight-background;
                    overflow: hidden;
                    .song {
                        .text-ellipsis();
                        line-height: 26px;
                    }
                }
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

