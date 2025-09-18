import { User } from "@/lib/api";
import { LabelInput } from "./label-input";
import { formatCel } from "@/utils/formatters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface PerfilContactTabProps {
  contactData: ProfileData["contact"] | null;
  setContactData: (data: ProfileData["contact"]) => void;
}

export function PerfilContactTab({
  contactData,
  setContactData,
}: PerfilContactTabProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "phone_number") {
      newValue = formatCel(value);
    }

    setContactData({
      email: contactData?.email ?? "",
      phone_number: contactData?.phone_number ?? "",
      [name]: newValue,
    });
  };

  return (
    <div className="flex flex-col items-start gap-6 relative self-stretch h-[150px] w-full">
      <div className="flex flex-col items-start gap-4 w-full">
        <div className="relative w-fit font-h2 font-[number:var(--h2-font-weight)] text-greyscale-40 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
          Dados de contato
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-col lg:flex-row items-start gap-4 w-full">
          <div className="flex flex-col gap-4 w-full group">
            <LabelInput
              id="email"
              name="email"
              value={contactData?.email ?? ""}
              onChange={handleChange}
              label="E-mail"
              disabled
            />
            <div className="hidden group-hover:flex items-end flex-col gap-4 w-full">
              <Alert
                variant="destructive"
                className="flex gap-2 p-4 w-[343px] bg-[#fef2f2] rounded-sm border border-solid border-[#dc2626]"
              >
                <X className="w-4 h-4 mt-0.5" />
                <AlertDescription className="font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
                  Não é possível editar o E-mail. Se necessário, entre em
                  contato com o suporte
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full group">
            <LabelInput
              id="mobile"
              name="phone_number"
              value={formatCel(
                contactData?.phone_number ? contactData.phone_number : ""
              )}
              onChange={handleChange}
              label="Telefone"
              disabled
            />
            <div className="hidden group-hover:flex items-end flex-col gap-4 w-full">
              <Alert
                variant="destructive"
                className="flex gap-2 p-4 w-[343px] bg-[#fef2f2] rounded-sm border border-solid border-[#dc2626]"
              >
                <X className="w-4 h-4 mt-0.5" />
                <AlertDescription className="font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
                  Não é possível editar o Telefone. Se necessário, entre em
                  contato com o suporte
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
