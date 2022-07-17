import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/store',
  },
  {
    path:'/ebook',
    component:()=>import ('@/pages/ebook'),
    children: [
      {
        path:':filename',
        component:()=>import('@/components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path:'/store',
    component: () => import('@/pages/store'),
    redirect:'/store/home',
    children: [
      {
        path:'shelf',
        component:()=>import('@/pages/store/StoreShelf')
      },
      {
        path:'category',
        component:()=>import('@/pages/store/StoreCategory')
      },
      {
        path:'home',
        component:()=> import ('@/pages/store/StoreHome'),
      },
      {
        path:'list',
        component: ()=>import('@/pages/store/StoreList'),
      },
      {
        path:'detail',
        component:()=>import('@/pages/store/StoreDetail'),
      },
      {
        path:'speaking',
        component:()=>import('@/pages/store/StoreSpeaking'),
      }
    ]
  }
]

const router = new VueRouter({
  mode:'hash',
  routes
})

export default router
