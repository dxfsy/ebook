import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/ebook',
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
  }
]

const router = new VueRouter({
  mode:'hash',
  routes
})

export default router
