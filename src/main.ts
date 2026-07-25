import './styles/base.css'
import './styles/home.css'
import './styles/lab.css'
import { bootstrap } from './app/bootstrap'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('#app missing')
}

bootstrap(app)
