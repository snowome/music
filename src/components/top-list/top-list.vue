<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
    import MusicList from 'components/music-list/music-list.vue'
    import {mapGetters} from 'vuex'
    import {getMusicList} from 'api/rank.js'
    import {ERR_OK} from 'api/config.js'
    import {createSong} from 'common/js/song.js'

    export default {
        data() {
            return {
                songs: [],
                rank: true
            }
        },
        computed: {
            title() {
                return this.topList.topTitle
            },
            bgImage() {
                if (this.songs.length) {
                    return this.songs[0].image
                }
                return this.topList.picUrl
            },
            ...mapGetters([
                'topList'
            ])
        },
        created() {
            this._getMusicList()
        },
        mounted() {
            console.log(this.songs)
        },
        methods: {
            _getMusicList() {
                if (!this.topList.id) {
                    this.$router.push({
                        path: '/rank'
                    })
                    return
                }
                getMusicList(this.topList.id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.songlist)
                    }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((item) => {
                    const musicData = item.data
                    if (musicData.songmid && musicData.albummid) {
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

<style scoped lang="less" type="text/less" rel="stylesheet/less">
    .slide-enter-active, .slide-leave-active {
        transition: all 0.3s ease;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
</style>
