<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <base-scroll class="shortcut" :data="shortcut" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" v-for="item in hotkey" @click="addQuery(item.k)"><span>{{item.k}}</span></li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
                        </h1>
                        <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
                    </div>
                </div>
            </base-scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest :query="query"
                     @listScroll="blurInput"
                     @select="saveSearchHistory(query)"
                     ref="suggest"></suggest>
        </div>
        <confirm ref="confirm"
                 text="是否清空所有搜索历史"
                 confirmBtnText="清空"
                 cancelBtnText="取消"
                 @confirm="ClearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box.vue'
    import {getHotKey} from 'api/search.js'
    import {ERR_OK} from 'api/config.js'
    import Suggest from 'components/suggest/suggest.vue'
    import SearchList from 'base/search-list/search-list.vue'
    import Confirm from 'base/confirm/confirm.vue'
    import {mapActions} from 'vuex'
    import BaseScroll from 'base/scroll/scroll.vue'
    import {playListMixin, searchMix} from 'common/js/mixin.js'

    export default {
        mixins: [playListMixin, searchMix],
        data() {
            return {
                hotkey: []
            }
        },
        computed: {
            shortcut() {
                return this.hotkey.concat(this.searchHistory)
            }
        },
        created() {
            this._getHotKey()
        },
        methods: {
            handlePlayList(playList) {
                const bottom = playList.length ? '60px' : ''
                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    if (res.code === ERR_OK) {
                        this.hotkey = res.data.hotkey.slice(0, 10)
                    }
                })
            },
            ...mapActions([
                'ClearSearchHistory'
            ])
        },
        watch: {
            query(newQuery) {
                if (!newQuery) {
                    setTimeout(() => {
                        this.$refs.shortcut.refresh()
                    }, 20)
                }
            }
        },
        components: {
            SearchBox,
            Suggest,
            SearchList,
            Confirm,
            BaseScroll
        }
    }
</script>

<style scoped lang="less" type="text/less" rel="stylesheet/less">
@import "~common/css/variable.less";
@import "~common/css/mixin.less";

.search {
    .search-box-wrapper {
        margin: 20px;
    }
    .shortcut-wrapper {
        position: fixed;
        top: 178px;
        bottom: 0;
        width: 100%;
        .shortcut {
            height: 100%;
            overflow: hidden;
            .hot-key {
                margin: 0 20px 20px 20px;
                .title {
                    margin-bottom: 20px;
                    font-size: @font-size-medium;
                    color: @color-text-l;
                }
                .item {
                    display: inline-block;
                    padding: 5px 10px;
                    margin: 0 20px 10px 0;
                    border-radius: 6px;
                    background: @color-highlight-background;
                    font-size: @font-size-medium;
                    color: @color-text-d;
                }
            }
            .search-history {
                position: relative;
                margin: 0 20px;
                .title {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    font-size: @font-size-medium;
                    color: @color-text-l;
                    .text {
                        flex: 1;
                    }
                    .clear {
                        .extend-click();
                        .icon-clear {
                            font-size: @font-size-medium;
                            color: @color-text-d;
                        }
                    }
                }
            }
        }
    }
    .search-result {
        position: fixed;
        width: 100%;
        top: 178px;
        bottom: 0;
    }
}
</style>
