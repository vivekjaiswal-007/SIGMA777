export const openAuthModal = (mode = 'login') => {
  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }))
}
