import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { personalInfo } from '../mock/mockData';
import contactService from '../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');
    
    try {
      await contactService.sendMessage(formData);
      setSubmitMessage('¡Mensaje enviado con éxito! Te contactaré pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      setSubmitError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
      setTimeout(() => {
        setSubmitError('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#1a1a1a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">contacto</h2>
          <div className="h-1 w-24 bg-emerald-500"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Ponte en contacto</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              ¿Tienes un proyecto en mente? ¿Quieres colaborar? No dudes en contactarme. 
              Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Email</p>
                  <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-emerald-500 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Teléfono</p>
                  <a href={`tel:${personalInfo.phone}`} className="text-gray-400 hover:text-emerald-500 transition-colors">
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Ubicación</p>
                  <p className="text-gray-400">{personalInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white font-semibold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-white font-semibold mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Asunto del mensaje"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-semibold mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Enviando...' : (
                  <>
                    <Send size={20} />
                    Enviar mensaje
                  </>
                )}
              </button>

              {submitMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-500 text-center">
                  {submitMessage}
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center">
                  {submitError}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;