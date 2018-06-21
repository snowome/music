<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            title: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped type="text/less" lang="less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";

    .no-result {
        text-align: center;
        .no-result-icon {
            width: 86px;
            height: 90px;
            margin: 0 auto;
            .bg-image('~base/no-result/no-result');
            background-size: 86px 90px;
        }
        .no-result-text {
            margin-top: 30px;
            font-size: @font-size-medium;
            color: @color-text-d;
        }
    }
</style>
