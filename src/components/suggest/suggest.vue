<template>
    <scroll class="suggest"
            :data="result"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"
            ref="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="seectItem(item)">
                <div class="icon">
                    <i :class="getItemCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import {search} from 'api/search.js'
    import {ERR_OK} from 'api/config.JS'
    import {createSong} from 'common/js/song.js'
    import Scroll from 'base/scroll/scroll.vue'
    import Loading from 'base/loading/loading.vue'
    import Singer from 'common/js/singer.js'
    import {mapMutations, mapActions} from 'vuex'
    import NoResult from 'base/no-result/no-result.vue'

    const TYPE_SINGER = 'singer'
    const perpage = 20

    export default {
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                page: 1,
                result: [],
                pullup: true,
                beforeScroll: true,
                hasMore: true
            }
        },
        methods: {
            search() {
                this.page = 1
                this.hasMore = true
                this.$refs.suggest.scrollTo(0, 0)
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this._getResult(res.data)
                        this._checkMore(res.data)
                    }
                })
            },
            searchMore() {
                if (!this.hasMore) {
                    return
                }
                this.page ++
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this.result.concat(this._getResult(res.data))
                        this._checkMore(res.data)
                    }
                })
            },
            getItemCls(item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-mine'
                } else {
                    return 'icon-music'
                }
            },
            getDisplayName(item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                } else {
                    return `${item.name} - ${item.singer}`
                }
            },
            seectItem(item) {
                if (item.type === TYPE_SINGER) {
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    })
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    this.setSinger(singer)
                } else {
                    this.insertSong(item)
                }
                this.$emit('select')
            },
            refresh() {
                this.$refs.suggest.refresh()
            },
            listScroll() {
                this.$emit('listScroll')
            },
            _checkMore(data) {
                const song = data.song
                if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
                    this.hasMore = false
                }
            },
            _getResult(data) {
                let ret = []
                if (data.zhida) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                }
                if (data.song) {
                    ret = ret.concat(this._normalizeSongs(data.song.list))
                }
                return ret
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                    if (musicData.songid && musicData.albumid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'         //  vuex用法：这个 SET_SINGER 对应 src/stoe/mutation-type.js 里的 export const SET_SINGER
            }),
            ...mapActions([
                'insertSong'
            ])
        },
        watch: {
            query(newQuery) {
                this.search()
            }
        },
        components: {
            Scroll,
            Loading,
            NoResult
        }
    }
</script>

<style scoped type="text/less" lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";

    .suggest {
        height: 100%;
        overflow: hidden;
        .suggest-list {
            padding: 0 30px;
            .suggest-item {
                display: flex;
                align-items: center;
                padding-bottom: 20px;
                .icon {
                    flex: 0 0 30px;
                    width: 30px;
                    [class^="icon-"] {
                        font-size: 14px;
                        color: @color-text-d;
                    }
                }
                .name {
                    flex: 1;
                    font-size: @font-size-medium;
                    color: @color-text-d;
                    overflow: hidden;
                    .text {
                        .text-ellipsis();
                    }
                }
            }
        }
        .no-result-wrapper {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>
