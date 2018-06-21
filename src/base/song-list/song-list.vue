<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(song,index) in songs" @click="selectItem(song, index)">
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)">{{getRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            songs: {
                type: Array,
                default() {
                    return []
                }
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getDesc(song) {
                return `${song.singer}.${song.album}`
            },
            selectItem(item, index) {
                this.$emit('select', item, index)
            },
            getRankCls(index) {
                if (index < 3) {
                    return `icon icon${index}`
                }
                return 'text'
            },
            getRankText(index) {
                if (index > 2) {
                    return index + 1
                }
                return ''
            }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";
    .song-list {
        .item {
            display: flex;
            align-items: center;
            height: 64px;
            font-size: @font-size-medium;
            box-sizing: border-box;
            .rank {
                flex: 0 0 25px;
                width: 25px;
                margin-right: 30px;
                text-align: center;
                .icon {
                    display: inline-block;
                    width: 25px;
                    height: 24px;
                    background-size: 25px 24px;
                    &.icon0 {
                        .bg-image("~base/song-list/first");
                    }
                    &.icon1 {
                        .bg-image('~base/song-list/second');
                    }
                    &.icon2 {
                        .bg-image('~base/song-list/third');
                    }
                }
                .text {
                    font-size: @font-size-large;
                    color: @color-theme;
                }
            }
            .content {
                flex: 1;
                line-height: 20px;
                .name {
                    color: @color-text;
                    .text-ellipsis();
                }
                .desc {
                    margin-top: 4px;
                    color: @color-text-d;
                    .text-ellipsis();
                }
            }
        }
    }
</style>
