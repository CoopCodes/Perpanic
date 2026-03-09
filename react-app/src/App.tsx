import './index.css'
import { Link, Route, Switch } from 'wouter'
import { HeaderNav } from './components/HeaderNav'
import { HomePage } from './pages/HomePage'
import { GalleryPage } from './pages/GalleryPage'

function NotFound() {
  return (
    <div className="min-h-screen bg-textured-black flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl text-white">Page not found</h1>
      <Link href="/" className="text-white underline hover:no-underline">
        Back to home
      </Link>
    </div>
  )
}

function App() {
  return (
    <>
      <HeaderNav />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  )
}

export default App
