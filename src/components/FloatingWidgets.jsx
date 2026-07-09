import { useState } from 'react'

export default function FloatingWidgets() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  const handleWhatsAppClick = () => {
    const phoneNumber = '919175882245'
    const message = encodeURIComponent('Hello! I want to inquire about your services.')
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="floating-whatsapp-button"
        title="Chat with us on WhatsApp"
        aria-label="Open WhatsApp chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.159-.173.193-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a6.963 6.963 0 00-6.993 6.99c0 1.232.23 2.433.677 3.572l-1.064 3.91 4.024-1.053c1.055.577 2.266.893 3.59.893h.003a6.995 6.995 0 006.993-6.99 6.979 6.979 0 00-2.048-4.95 6.972 6.972 0 00-4.945-2.049" />
        </svg>
      </button>

      {/* Inquiry Form Toggle Button */}
      <button
        onClick={() => setIsInquiryOpen(!isInquiryOpen)}
        className="floating-inquiry-toggle"
        title="Send us an inquiry"
        aria-label="Open inquiry form"
        aria-expanded={isInquiryOpen}
      >
        {isInquiryOpen ? '✕' : '?'}
      </button>

      {/* Inquiry Form Panel */}
      <div className={`floating-inquiry-panel ${isInquiryOpen ? 'is-open' : ''}`}>
        <h3 style={{ marginTop: 0, marginBottom: '0.8rem', fontSize: '1.1rem', color: '#1a1a1a' }}>
          Quick Inquiry
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const data = {
              name: formData.get('name'),
              email: formData.get('email'),
              message: formData.get('message'),
            }
            
            fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
              .then((res) => {
                if (res.ok) {
                  alert('Thank you! We will get back to you soon.')
                  setIsInquiryOpen(false)
                  e.target.reset()
                } else {
                  alert('Error submitting form. Please try again.')
                }
              })
              .catch(() => alert('Error. Please try again.'))
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            style={{
              padding: '0.6rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            style={{
              padding: '0.6rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
            }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="3"
            required
            style={{
              padding: '0.6rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.7rem',
              background: 'linear-gradient(135deg, #00bfa6, #00897b)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Send Inquiry
          </button>
        </form>
      </div>
    </>
  )
}
