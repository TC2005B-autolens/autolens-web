import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './App'
import './globals.css'
import CourseScreen from './routes/courses'
import NewAssignmentScreen from './routes/new_assignment'
import AIAnalyzerScreen from './routes/ai-analyzer'
import DemoScreen from './routes/demo'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename='/app'>
      <Routes>
        <Route element={<Dashboard/>}>
          <Route path='/' element={ <Navigate to='courses'/> } />
          <Route path='courses' element={ <CourseScreen/> } />
          <Route path='groups' element={<div>Groups</div>} />
          <Route path='submissions' element={<div>Submissions</div>} />
          <Route path='new-assignment' element={ <NewAssignmentScreen/> } />
          <Route path='demo' element={<DemoScreen/>} />
          <Route path='ai-analyzer' element={ <AIAnalyzerScreen/> } />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)