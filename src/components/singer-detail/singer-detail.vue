<template>
    <transition name="slide">
        <music-list :bg-image="bgImage" :songs="songs" :title="singer.name"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex'
    import { getSingerDetail } from 'api/singer.js'
    import { ERR_OK } from 'api/config.js'
    import { createSong } from 'common/js/song.js'
    import MusicList from 'components/music-list/music-list.vue'

    export default {
        data() {
            return {
                songs: []
            }
        },
        computed: {
            ...mapGetters([
                'singer'     // vuex用法：这个 singer 对应 src/stoe/getters.js 里的 export const singer = ...
            ]),
            title() {
                return this.singer.name
            },
            bgImage() {
                return this.singer.avatar
            }
        },
        created() {
            this._getDetail(this.singer.id)
        },
        methods: {
            _getDetail(id) {
                if (!id) {
                    this.$router.push({
                        path: '/singer'
                    })
                }
                getSingerDetail(id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._noramlizeSongs(res.data.list)
                    }
                })
            },
            _noramlizeSongs(list) {
                let ret = []
                list.forEach((item) => {
                    let {musicData} = item
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        components: {
            MusicList
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    .slide-enter-active, .slide-leave-active {
        transition: all .3s ease;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
</style>
