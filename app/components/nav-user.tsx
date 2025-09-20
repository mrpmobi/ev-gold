"use client";

import { ArrowLeft, UserSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/get-initials";
import { AlterarSenhaDialog } from "./alterar-senha-dialog";

interface NavUserProps {
  name: string;
  handleLogout: () => void;
  setCurrentPage: (page: string) => void;
}

export function NavUser({ name, handleLogout, setCurrentPage }: NavUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="
          border-[#121212] bg-[#121212] hover:bg-primary 
          focus:outline-none focus:ring-0 focus:ring-offset-0
          active:ring-0 active:ring-offset-0
          focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#121212]
          group w-auto p-0 md:p-1
        "
        >
          <div className="px-0 md:px-2 w-auto flex flex-row items-center gap-2 md:gap-4 text-[#C0C0C0] group-hover:text-[#121212]">
            <span className="hidden lg:inline text-sm">{name}</span>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#C0C0C0] border-[#C0C0C0] text-[#121212] text-sm">{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-25 md:w-56 rounded-lg border-[#121212] bg-[#121212]" side={"bottom"}>
        <DropdownMenuGroup>

          <DropdownMenuItem
            className="text-[#C0C0C0] focus:bg-primary
            focus:text-[#121212]"
            onClick={() => setCurrentPage("perfil")}
          >
            <UserSquare className="w-6 h-6 focus:text-[#121212]" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-[#C0C0C0] focus:bg-primary
              focus:text-[#121212]"
            onClick={handleLogout}
          >
            <ArrowLeft className="w-6 h-6 focus:text-[#121212]" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
