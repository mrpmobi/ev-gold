"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  DollarSign,
  Home,
  List,
  ListChecks,
  Network,
  Share,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSideBarProps {
  setCurrentPage: (page: string) => void;
}

export function AppSidebar({ setCurrentPage }: AppSideBarProps) {
  function handleClick(page: string) {
    setCurrentPage(page);
    setOpenMobile(false);
  }

  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="pl-6 py-6 pr-0"
    >
      <SidebarHeader>
        <div className="px-6 py-8 justify-between w-full  flex items-center">
          <img src="/gold-logo.svg" alt="Logo" className="w-[99px] h-[35px]" />
          <Button
            onClick={() => setOpenMobile(false)}
            variant="ghost"
            size="icon"
            className="h-auto p-0 bg-transparent hover:bg-transparent md:hidden"
          >
            <X className="w-8 h-8" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-6 text-[#C0C0C0] text-sm">
          <SidebarGroupContent>
            <SidebarMenu className="gap-[8px]">
              <SidebarMenuItem key="home">
                <SidebarMenuButton
                  asChild
                  onClick={handleClick.bind(null, "home")}
                  className="hover:bg-primary"
                >
                  <div>
                    <Home />
                    <span className="hover:text-[#121212]">Home</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="redes">
                <SidebarMenuButton
                  asChild
                  onClick={handleClick.bind(null, "redes")}
                  className="hover:bg-primary"
                >
                  <div>
                    <Network />
                    <span>Redes</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="extrato">
                <SidebarMenuButton
                  asChild
                  onClick={handleClick.bind(null, "extrato")}
                  className="hover:bg-primary"
                >
                  <div>
                    <List />
                    <span>Extrato</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="saques">
                <SidebarMenuButton
                  asChild
                  onClick={handleClick.bind(null, "saques")}
                  className="hover:bg-primary"
                >
                  <div>
                    <DollarSign />
                    <span>Saques</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup className="text-sm">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="politica-privacide">
                <Link
                  href="/politica-de-privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Política de Privacidade"
                >
                  Política de privacidade
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem key="termos-condicoes">
                <Link
                  href="/termos-de-uso"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Termos de Uso"
                >
                  Termos e condições
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
