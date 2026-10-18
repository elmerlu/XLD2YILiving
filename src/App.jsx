import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Stories from './pages/Stories'
import Guide from './pages/Guide'
import Funding from './pages/Funding'
import PhotoCropper from './pages/PhotoCropper'
import SyncStatus from './pages/SyncStatus' // 內部工程頁，不對外
import NotFound from './pages/NotFound'
// Keep old pages for reference if needed, or remove. User didn't explicitly say delete, but "feature grid" replaces them?
// Let's keep the files but remove routes or re-route if needed.
// Actually, user said nav tabs are limited to the 4 items.
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Navigate to="/" replace />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/cropper" element={<PhotoCropper />} />
        <Route path="/sync-status" element={<SyncStatus />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App

