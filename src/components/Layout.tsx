import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavigationHeader, DoctorSidebar, PatientBottomNav } from '@/components/Navigation'
import { useVivans } from '@/context/VivansContext'

export function Layout() {
  const { role, toastMessage } = useVivans()
  const location = useLocation()

  const isDoctorRoute = location.pathname.startsWith('/medico')
  const isPatientRoute = location.pathname.startsWith('/paciente')

  return (
    <div className="min-h-screen bg-[#f5f8f6] text-[#17372f] flex flex-col font-sans">
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[#17372f] focus:text-white focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#9fe0ce]"
      >
        Pular para o conteúdo principal
      </a>

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Global in-app Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 rounded-2xl bg-[#17372f] text-white px-5 py-3 text-xs font-semibold shadow-2xl animate-fade-in-down flex items-center gap-2 border border-white/20">
          <span className="size-2 rounded-full bg-[#9fe0ce] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="mx-auto flex w-full max-w-[1540px] flex-1 min-h-[calc(100vh-72px)]">
        {/* Desktop Doctor Sidebar */}
        {(isDoctorRoute || (!isPatientRoute && role === 'doctor')) && <DoctorSidebar />}

        {/* Content Container */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Patient Bottom Navigation */}
      <PatientBottomNav />
    </div>
  )
}

export default Layout
