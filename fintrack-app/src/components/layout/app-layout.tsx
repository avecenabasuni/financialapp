import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import TopBar from './topbar';
import AddTransactionModal from '@/components/modals/add-transaction-modal';
import CommandPalette from '@/components/shared/command-palette';
import { useTransactionStore } from '@/store/useTransactionStore';

export default function AppLayout() {
  const { isAddModalOpen, closeAddModal, editingTransaction } = useTransactionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onSearchClick={() => setPaletteOpen(true)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <AddTransactionModal 
        open={isAddModalOpen} 
        onClose={closeAddModal} 
        initialData={editingTransaction} 
      />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
