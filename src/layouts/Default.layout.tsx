import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export function DefaultLayout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* espaço para inserir um conteudo */}
    </div>
  )
}
