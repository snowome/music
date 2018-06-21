<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">Chicken Music</h1>
    </div>
</template>
<script type="text/ecmascript-6">

</script>
<style scoped lang="less" type="text/less" rel="stylesheet/less">
    @import "~common/css/variable.less";
    @import "~common/css/mixin.less";
    .m-header {
        position: relative;
        height: 44px;
        font-size: 0;
        color: @color-theme;
        text-align: center;
        .icon {
            display: inline-block;
            margin-top: 6px;
            margin-right: 9px;
            vertical-align: top;
            width: 30px;
            height: 32px;
            .bg-image("~components/m-header/logo");
            background-size: 100% 100%;
        }
        .text {
            display: inline-block;
            vertical-align: top;
            line-height: 44px;
            font-size: @font-size-large;
        }
    }
</style>