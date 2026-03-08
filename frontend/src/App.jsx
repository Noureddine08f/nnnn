import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Classrooms from './pages/Classrooms';
import Courses from './pages/Courses';
import Classes from './pages/Classes';
import Assignments from './pages/Assignments';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import TimeSlots from './pages/TimeSlots';
import Login from './pages/Login';
import './i18n';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classrooms" element={<Classrooms />} />
          <Route path="courses" element={<Courses />} />
          <Route path="classes" element={<Classes />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="time-slots" element={<TimeSlots />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
