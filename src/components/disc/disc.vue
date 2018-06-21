<template>
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
    import MusicList from 'components/music-list/music-list.vue'
    import {mapGetters} from 'vuex'
    import {getSongList} from 'api/recommend.js'
    import {ERR_OK} from 'api/config.js'
    import {createSong} from 'common/js/song.js'

    export default {
        data() {
            return {
                songs: []
            }
        },
        computed: {
            title() {
                return this.disc.dissname
            },
            bgImage() {
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        created() {
            this._getSongList()
        },
        methods: {
            _getSongList() {
                if (!this.disc.dissid) {
                    this.$router.push('/recommend')
                    return
                }
                getSongList(this.disc.dissid).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                    }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                    if (musicData.songid && musicData.albumid) {
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
    .slide-enter-active, .slide-leave-active {
        transition: all .3s ease;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
</style>
