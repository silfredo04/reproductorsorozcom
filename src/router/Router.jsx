import React from 'react'
import { Routes,Route,BrowserRouter,Navigate,Link } from 'react-router-dom'
import { Reproductor } from '../componente/Reproductor'

export const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
           {/*  Rutas publicas */}
           <Route path='/' element={<Reproductor/>}/>
           <Route index element={<Reproductor/>}/>
           <Route path='inicio' element={<Reproductor/>} />
        </Routes>
    </BrowserRouter>
  )
}
