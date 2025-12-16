import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Code, Calendar, BookOpen, BarChart2, User, LogOut, Download, TrendingUp, NotebookPen, CalendarCheck, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from "lucide-react";

interface HeaderProps {
  title?: string;
  onExportData?: () => void;
}

export function Header({ title = '', onExportData }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5 mr-3" />,
  },
  {
    name: 'Daily Plan',
    href: '/daily-plan',
    icon: <CalendarCheck className="h-5 w-5 mr-3" />,
  },
  {
    name: 'Journey Log',
    href: '/journey-log',
    icon: <NotebookPen className="h-5 w-5 mr-3" />,
  },
  {
    name: 'Statistics',
    href: '/stats',
    icon: <TrendingUp className="h-5 w-5 mr-3" />,
  },
];



  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-3">
  <img
    src="/logo-full-light.png"
    className="block dark:hidden h-12 w-auto object-contain drop-shadow-md"
    alt="TrackMyProgress Logo Light"
  />
  <img
    src="/logo-full-dark.png"
    className="hidden dark:block h-12 w-auto object-contain drop-shadow-md"
    alt="TrackMyProgress Logo Dark"
  />

  <span className="text-2xl font-semibold hidden sm:block">
    {title}
  </span>
</div>

          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-4 transition-all duration-300">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className="flex items-center hover:bg-secondary transition-colors duration-200"
              >
                <Link to={item.href} className="transition-all duration-200 hover:translate-x-0.5">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Export Data Button - Only show when logged in */}
            {user && onExportData && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onExportData}
                title="Export your data"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}

            {/* User Menu - Only show when logged in */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild size="sm">
                <a href="/login">Login</a>
              </Button>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navigation menu with links to different pages</SheetDescription>
                  <div className="flex flex-col gap-4 py-4 transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between mb-4 hover:opacity-80 transition-opacity duration-200">
                      <div className="flex items-center text-muted-foreground">


                        <img src="/logo-full-light.png" alt="TrackMyProgress" className="h-30 w-30 block dark:hidden " />

                           <img src="/logo-full-dark.png" alt="TrackMyProgress" className="h-30 w-30 hidden dark:block" />


                        <span className="ml-2 text-lg font-semibold">{title}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                       
                      </Button>
                    </div>
                    <nav className="flex flex-col space-y-2 transition-all duration-300">
                      {navigation.map((item) => (
                        <Button
                          key={item.name}
                          variant="ghost"
                          asChild
                          className="justify-start hover:bg-secondary transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link to={item.href} className="flex items-center transition-all duration-200 hover:translate-x-1">
                            {item.icon}
                            {item.name}
                          </Link>
                        </Button>
                      ))}

                      {/* Mobile Theme Toggle */}
                      <div className="pt-4 border-t transition-all duration-300 hover:bg-opacity-50">
                        <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                          <span className="text-sm">Appearance</span>
                          <ThemeToggle />
                        </div>
                      </div>

                      {/* Export Data - Only show when logged in */}
                      {user && onExportData && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full hover:bg-secondary transition-colors duration-200"
                          onClick={() => {
                            onExportData();
                            setIsMenuOpen(false);
                          }}
                        >
                          <Download className="h-5 w-5 mr-2 transition-transform duration-200 hover:scale-110" />
                          Export Data
                        </Button>
                      )}

                      {/* User Login/Logout */}
                      {user ? (
                        <>
                          <div className="pt-4 border-t transition-all duration-300 hover:bg-opacity-50">
                            <div className="flex flex-col transition-opacity duration-200 hover:opacity-80">
                              <span className="text-sm font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="justify-start w-full text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="h-5 w-5 mr-2 transition-transform duration-200 hover:rotate-180" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          asChild
                          className="justify-start w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link to="/login" className="flex items-center transition-all duration-200 hover:translate-x-1">
                            <User className="h-5 w-5 mr-2 transition-transform duration-200 hover:scale-110" />
                            Login
                          </Link>
                        </Button>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
