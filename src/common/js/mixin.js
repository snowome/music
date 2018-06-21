import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'

export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    created() {
        // console.log('created')
    },
    mounted() {
        // console.log('mounted')
        this.handlePlayList(this.playList)
    },
    activated() {
        // console.log('activated')
        this.handlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList(playList) {
            throw new Error('component must implement handlePlayList method')
        }
    }
}

export const playerMixin = {
    computed: {
        iconMode() {
            return this.model === playMode.sequence ? 'icon-sequence' : this.model === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playList',
            'model'
        ])
    },
    methods: {
        changeMode() {
            const model = (this.model + 1) % 3
            this.setPlayMode(model)
            let list = null
            if (model === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setPlayState: 'SET_PLAYING',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_MODEL',
            setPlayList: 'SET_PLAY_LIST'
        })
    }
}

export const searchMix = {
    data() {
        return {
            query: ''
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        blurInput() {
            this.$refs.searchBox.blur()
        },
        onQueryChange(query) {
            this.query = query
        },
        addQuery(k) {
            this.$refs.searchBox.setQuery(k)
        },
        ...mapActions([
            'deleteSearchHistory',
            'saveSearchHistory'
        ])
    }
}
