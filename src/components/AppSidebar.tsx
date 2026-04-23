import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Wrench, Building2, ChevronLeft, ChevronRight, Menu, X, UserCheck, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, isTecnico, user, signOut } = useAuth();

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/inventario", label: "Inventário", icon: Package },
    { to: "/manutencoes", label: "Manutenções", icon: Wrench },
    ...(isAdmin ? [{ to: "/admin/aprovacoes", label: "Aprovações", icon: UserCheck }] : []),
  ];

  const roleBadge = isAdmin ? "Admin" : isTecnico ? "Técnico" : "Usuário";

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">SENAI</h1>
            <p className="text-[10px] text-sidebar-foreground opacity-70 truncate">Gestão de Laboratórios</p>
          </div>
        )}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      {/* User info & logout */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <div className="px-2">
            <p className="text-xs text-sidebar-foreground truncate">{user?.email}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-accent-foreground">
              {roleBadge}
            </span>
          </div>
        )}
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center gap-3 px-4 border-b border-sidebar-border bg-sidebar">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Building2 className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">SENAI</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 gradient-sidebar flex flex-col border-r border-sidebar-border animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">SENAI</h1>
                  <p className="text-[10px] text-sidebar-foreground opacity-70">Gestão de Laboratórios</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="border-t border-sidebar-border p-3 space-y-2">
              <div className="px-2">
                <p className="text-xs text-sidebar-foreground truncate">{user?.email}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-accent-foreground">
                  {roleBadge}
                </span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors w-full"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "gradient-sidebar hidden md:flex flex-col border-r border-sidebar-border transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-2 mb-4 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
