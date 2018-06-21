import {playMode} from 'common/js/config.js'
import {loadSearch, loadPlay} from 'common/js/cache.js'

const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    model: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay()
}

export default state
