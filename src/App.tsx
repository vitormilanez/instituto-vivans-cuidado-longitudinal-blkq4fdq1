import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'

// Patient Journey Pages
import PatientToday from '@/pages/patient/Today'
import PatientPlan from '@/pages/patient/Plan'
import PatientDiary from '@/pages/patient/Diary'
import PatientEvolution from '@/pages/patient/Evolution'
import PatientMessages from '@/pages/patient/Messages'
import PatientAppointments from '@/pages/patient/Appointments'
import PatientPreConsultation from '@/pages/patient/PreConsultation'
import PatientPrescriptionsExams from '@/pages/patient/PrescriptionsExams'

// Doctor Journey Pages
import DoctorOverview from '@/pages/doctor/Overview'
import DoctorAgenda from '@/pages/doctor/Agenda'
import DoctorPatients from '@/pages/doctor/Patients'
import DoctorPatientDetail from '@/pages/doctor/PatientDetail'
import DoctorMessages from '@/pages/doctor/Messages'
import DoctorReports from '@/pages/doctor/Reports'
import DoctorConsultationRoom from '@/pages/doctor/ConsultationRoom'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Gateway Index */}
        <Route path="/" element={<Index />} />

        {/* Doctor Routes */}
        <Route path="/medico" element={<DoctorOverview />} />
        <Route path="/medico/agenda" element={<DoctorAgenda />} />
        <Route path="/medico/pacientes" element={<DoctorPatients />} />
        <Route path="/medico/pacientes/:id" element={<DoctorPatientDetail />} />
        <Route path="/medico/mensagens" element={<DoctorMessages />} />
        <Route path="/medico/relatorios" element={<DoctorReports />} />
        <Route path="/medico/consulta/:id" element={<DoctorConsultationRoom />} />

        {/* Patient Routes */}
        <Route path="/paciente" element={<PatientToday />} />
        <Route path="/paciente/plano" element={<PatientPlan />} />
        <Route path="/paciente/diario" element={<PatientDiary />} />
        <Route path="/paciente/evolucao" element={<PatientEvolution />} />
        <Route path="/paciente/mensagens" element={<PatientMessages />} />
        <Route path="/paciente/consultas" element={<PatientAppointments />} />
        <Route path="/paciente/pre-consulta" element={<PatientPreConsultation />} />
        <Route path="/paciente/receitas-exames" element={<PatientPrescriptionsExams />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
