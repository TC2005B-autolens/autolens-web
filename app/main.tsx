import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './App'
import './globals.css'
import CourseScreen from './routes/courses'
import NewAssignmentScreen from './routes/new-assignment'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename='/app'>
      <Routes>
        <Route element={<Dashboard/>}>
          <Route path='courses' element={ <CourseScreen/> } />
          <Route path='groups' element={<div>Groups</div>} />
          <Route path='submissions' element={<div>Submissions</div>} />
          <Route path='new-assignment' element={ <NewAssignmentScreen/> } />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
