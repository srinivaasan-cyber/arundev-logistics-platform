import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { FullScreenLoader } from '@/components/FullScreenLoader'

import { LoginPage } from '@/pages/LoginPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'
import { AccountDisabledPage } from '@/pages/AccountDisabledPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

import { StaffLayout } from '@/layouts/StaffLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { DriverLayout } from '@/layouts/DriverLayout'

import { StaffDashboard } from '@/pages/staff/StaffDashboard'
import { StaffVehicles } from '@/pages/staff/StaffVehicles'
import { StaffDrivers } from '@/pages/staff/StaffDrivers'
import { StaffCustomers } from '@/pages/staff/StaffCustomers'
import { StaffTrips } from '@/pages/staff/StaffTrips'
import { StaffInvoices } from '@/pages/staff/StaffInvoices'
import { StaffSettings } from '@/pages/staff/StaffSettings'

import { CustomerDashboard } from '@/pages/customer/CustomerDashboard'
import { CustomerBookings } from '@/pages/customer/CustomerBookings'
import { CustomerInvoices } from '@/pages/customer/CustomerInvoices'

import { DriverDashboard } from '@/pages/driver/DriverDashboard'
import { DriverTrips } from '@/pages/driver/DriverTrips'
import { DriverVehicle } from '@/pages/driver/DriverVehicle'

export default function App() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user && profile ? <Navigate to={portalHome(profile.user_type)} replace /> : <LoginPage />}
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/account-disabled" element={<AccountDisabledPage />} />

      {/* Staff portal */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedUserTypes={['STAFF']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="vehicles" element={<StaffVehicles />} />
        <Route path="drivers" element={<StaffDrivers />} />
        <Route path="customers" element={<StaffCustomers />} />
        <Route path="trips" element={<StaffTrips />} />
        <Route path="invoices" element={<StaffInvoices />} />
        <Route path="settings" element={<StaffSettings />} />
      </Route>

      {/* Customer portal */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedUserTypes={['CUSTOMER', 'PARTNER']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="shipments" element={<CustomerBookings />} />
        <Route path="invoices" element={<CustomerInvoices />} />
      </Route>

      {/* Driver portal */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute allowedUserTypes={['DRIVER']}>
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DriverDashboard />} />
        <Route path="trips" element={<DriverTrips />} />
        <Route path="vehicle" element={<DriverVehicle />} />
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          user && profile ? (
            <Navigate to={portalHome(profile.user_type)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function portalHome(userType: string): string {
  switch (userType) {
    case 'STAFF':
      return '/staff'
    case 'DRIVER':
      return '/driver'
    case 'CUSTOMER':
    case 'PARTNER':
      return '/customer'
    default:
      return '/unauthorized'
  }
}
