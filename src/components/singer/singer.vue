<template>
    <div class="sinner" ref="singer">
        <base-list-view :data="singers" @select="selectSinger" ref="list"></base-list-view>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import { getSingerList } from 'api/singer.js'
    import { ERR_OK } from 'api/config.js'
    import Singer from 'common/js/Singer.js'
    import BaseListView from 'base/listview/listview.vue'
    import { mapMutations } from 'vuex'
    import {playListMixin} from 'common/js/mixin.js'

    const HOT_NAME = '热门'
    const HOT_SINGER_LEN = 10

    export default {
        mixins: [playListMixin],
        data() {
            return {
                singers: []
            }
        },
        created() {
            this._getSingerLst()
        },
        methods: {
            handlePlayList(playList) {
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.list.refresh()
            },
            selectSinger(singer) {
//                console.log(singer)
                this.$router.push({                         // 路由跳转
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerLst() {
                getSingerList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.singers = this._normalizeSiner(res.data.list)
                    }
                })
            },
            _normalizeSiner(list) {
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                list.forEach((item, index) => {
                    if (index < HOT_SINGER_LEN) {
                        map.hot.items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }))
                    }
                    const key = item.Findex
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }))
                })
                let hot = []
                let ret = []
                for (let key in map) {
                    let val = map[key]
                    if (val.title.match(/[a-zA-Z]/)) {
                        ret.push(val)
                    } else if (val.title === HOT_NAME) {
                        hot.push(val)
                    }
                }
                ret.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(ret)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'         //  vuex用法：这个 SET_SINGER 对应 src/stoe/mutation-type.js 里的 export const SET_SINGER
            })
        },
        components: {
            BaseListView
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .sinner {
        position: fixed;
        top: 88px;
        left: 0;
        bottom: 0;
        width: 100%;
    }
</style>
