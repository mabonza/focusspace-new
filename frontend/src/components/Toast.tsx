import { Toaster, toast as hotToast } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          maxWidth: '380px',
          borderRadius: '2px',
        },
        success: {
          style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' },
          iconTheme: { primary: '#16a34a', secondary: '#fff' },
        },
        error: {
          style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' },
          iconTheme: { primary: '#dc2626', secondary: '#fff' },
        },
      }}
    />
  )
}

export const toast = {
  success: (msg: string) => hotToast.success(msg),
  error: (msg: string) => hotToast.error(msg),
  loading: (msg: string) => hotToast.loading(msg),
  dismiss: (id?: string) => hotToast.dismiss(id),
  promise: hotToast.promise,
}
