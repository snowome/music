import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend.vue'
// import Disc from 'components/disc/disc.vue'
// import Singer from 'components/singer/singer.vue'
// import Rank from 'components/rank/rank.vue'
// import Search from 'components/search/search.vue'
// import SingerDetail from 'components/singer-detail/singer-detail.vue'
// import TopList from 'components/top-list/top-list.vue'

Vue.use(Router)
/** 用路由懒加载代替上边 **/
const Recommend = () => import('components/recommend/recommend.vue')
const Disc = () => import('components/disc/disc.vue')
const Singer = () => import('components/singer/singer.vue')
const Rank = () => import('components/rank/rank.vue')
const Search = () => import('components/search/search.vue')
const SingerDetail = () => import('components/singer-detail/singer-detail.vue')
const TopList = () => import('components/top-list/top-list.vue')

export default new Router({
    routes: [
        {
            path: '/recommend',
            component: Recommend,
            children: [
                {
                    path: ':id',
                    component: Disc
                }
            ]
        },
        {
            path: '/singer',
            component: Singer,
            children: [
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/rank',
            component: Rank,
            children: [
                {
                    path: ':id',
                    component: TopList
                }
            ]
        },
        {
            path: '/search',
            component: Search,
            children: [
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '*',
            redirect: '/recommend'
        }
    ]
})
