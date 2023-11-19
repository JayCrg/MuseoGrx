import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TicketsView from '../views/TicketsView.vue'
import SignUpView from '../views/SignUpView.vue'
import AdminView from '../views/AdminView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import FoundOptionsView from '../views/FoundOptionsView.vue'
import DetailsView from '../views/DetailsView.vue'
import DetailsAuthorView from '../views/DetailsAuthorView.vue'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/entradas',
      name: 'entradas',
      component: TicketsView
    },
    {
      path: '/nueva-cuenta',
      name: 'nueva-cuenta',
      component: SignUpView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/privacidad',
      name: 'privacidad',
      component: PrivacyView
    },
    {
      path: '/encontradas',
      name: 'encontradas',
      component: FoundOptionsView
    },
    {
      path: '/detalle/obra/:id',
      name: 'detalle',
      props: true,
      component: DetailsView
    },
    {
      path: '/detalle/autor/:id',
      name: 'detalleAutor',
      props: true,
      component: DetailsAuthorView
    },
    // {
    //   path: '*', // Add the "Not Found" route
    //   name: 'not-found',
    //   component: NotFoundView
    // },  
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
