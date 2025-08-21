// components/HamburgerMenu.tsx
import React, { useState } from 'react';
import { Menu, X, Home, User, Settings, Mail, Info, LucideIcon } from 'lucide-react';
import { Button } from './button';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface HamburgerMenuProps {
  menuItems?: MenuItem[];
  title?: string;
  footerText?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  menuItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: User, label: 'Perfil', href: '/perfil' },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
    { icon: Mail, label: 'Contacto', href: '/contacto' },
    { icon: Info, label: 'Acerca de', href: '/acerca' },
  ],
  title = 'Menú',
  footerText = '© 2025 Tu Empresa'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa - fijo arriba a la derecha */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 left-8 z-50 p-3 bg-white hover:bg-gray-50 transition-all duration-200 "
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <div className="relative w-6 h-6">
          <Menu className={`absolute w-6 h-6 text-gray-700 transition-all duration-700 ${
            isOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
          }`} />
          <X className={`absolute w-6 h-6 text-gray-700 transition-all duration-700 ${
            isOpen ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-75'
          }`} />
        </div>
      </button>

      {/* Overlay para cerrar el menú en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menú lateral */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full' }
          w-full md:w-80
        `}
        role="navigation"
        aria-label="Menú principal"
      >
        {/* Header del menú */}
        <div className="pt-[6em] px-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Lista de elementos del menú */}
        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleLinkClick}
                  >
                    <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700 flex-shrink-0" />
                    <span className="text-base font-medium">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del menú */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-500 text-center">
            {footerText}
          </p>
        </div>
      </div>
    </>
  );
};

// Named export
export { HamburgerMenu };

// Default export (puedes usar ambos)
export default HamburgerMenu;