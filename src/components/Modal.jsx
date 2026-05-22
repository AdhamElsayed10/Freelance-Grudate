import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
}

export default function Modal({ open, onClose, title, children, size = 'lg' }) {
  const { lang } = useLanguage()

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full mx-4',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            key="modal-card"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl shadow-2xl border border-gold/10 w-full ${sizes[size]} max-h-[85vh] flex flex-col overflow-hidden`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 shrink-0">
              <h2 className="text-lg font-bold text-dark">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-cream text-dark/40 hover:text-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
