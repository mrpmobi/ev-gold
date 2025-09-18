import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/api";
import { getInitials } from "@/utils/get-initials";
import { Award, RotateCcw, Trash2, UserSquare } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { PerfilPersonalTab } from "./perfil-personal-tab";
import { ProgressCard } from "./progress-card";
import { PerfilContactTab } from "./perfil-contact-tab";
import { PerfilAddressTab } from "./perfil-address-tab";
import { authManager } from "../lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { maskCPF } from "@/utils/masks";
import { ProfileData } from "@/types/profile";
import { AlterarSenhaDialog } from "./alterar-senha-dialog";
import { toast } from "sonner";

const tabsData = [
  { value: "personal", label: "Dados pessoais" },
  { value: "contact", label: "Dados de contato" },
  { value: "address", label: "Endereço" },
];

interface PerfilProps {
  user: User;
  setUser: (user: User) => void;
}

// Função para calcular o percentual de preenchimento (fora do componente)
const calculateProfileCompletion = (data: ProfileData | null): number => {
  if (!data) return 0;

  const allFields = [
    data.personal.name,
    data.personal.username,
    data.personal.date_of_birth,
    data.personal.gender,
    data.personal.profession,
    data.personal.tax_id,
    data.contact.email,
    data.contact.phone_number,
    data.address.postal_code,
    data.address.address,
    data.address.number,
    data.address.complement,
    data.address.state,
    data.address.city,
    data.address.neighborhood,
  ];

  const filledFields = allFields.filter((field) => {
    if (field === null || field === undefined) return false;
    if (typeof field === "string" && field.trim() === "") return false;
    return true;
  }).length;

  return Math.round((filledFields / allFields.length) * 100);
};

export function Perfil({ user, setUser }: PerfilProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateAndSetCompletion = useCallback((data: ProfileData | null) => {
    setCompletedPercentage(calculateProfileCompletion(data));
  }, []);

  const handleSave = async () => {
    if (!profileData) return;

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Corrija os erros no formulário.");
      return;
    }

    const payload = {
      personal_data: {
        name: profileData.personal.name,
        username: profileData.personal.username ?? ".",
        date_of_birth: profileData.personal.date_of_birth
          ? profileData.personal.date_of_birth.toISOString().split("T")[0]
          : "",
        gender: profileData.personal.gender ?? ".",
        profession: profileData.personal.profession ?? ".",
        document: profileData.personal.tax_id ?? ".",
      },
      address: {
        postal_code: String(profileData.address.postal_code) ?? ".",
        country: 25,
        state: profileData.address.state ?? ".",
        complement: !profileData.address.complement?.trim()
          ? "."
          : profileData.address.complement,
        city: profileData.address.city ?? ".",
        neighborhood: profileData.address.neighborhood ?? ".",
        address: profileData.address.address ?? ".",
        number: profileData.address.number ?? ".",
      },
    };

    try {
      setSaving(true);
      const token = authManager.getToken();

      const response = await fetch(`${API_BASE_URL}/office/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        //console.log("Erros do backend:", data.errors);
      } else {
        //console.log("Perfil atualizado com sucesso:", data);
        alert("Perfil atualizado com sucesso!");
      }
    } catch (err) {
      //console.error("Erro ao salvar perfil:", err);
      alert("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!profileData?.personal.name.trim()) newErrors.name = "Nome obrigatório";
    if (!profileData?.personal.username?.trim())
      newErrors.username = "Nome de usuário obrigatório";
    if (!profileData?.personal.profession?.trim())
      newErrors.profession = "Profissão obrigatório";
    if (!profileData?.personal.gender) newErrors.gender = "Sexo obrigatório";
    if (!profileData?.personal.date_of_birth)
      newErrors.date_of_birth = "Data de nascimento obrigatória";
    if (!profileData?.address.postal_code?.toString().trim())
      newErrors.postal_code = "CEP obrigatório";
    if (!profileData?.address.address?.trim())
      newErrors.address = "Endereço obrigatório";
    if (!profileData?.address.number?.toString().trim())
      newErrors.number = "Número obrigatório";
    if (!profileData?.address.state?.trim())
      newErrors.state = "Estado obrigatório";
    if (!profileData?.address.city?.trim())
      newErrors.city = "Cidade obrigatória";
    if (!profileData?.address.neighborhood?.trim())
      newErrors.neighborhood = "Bairro obrigatório";
    return newErrors;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = authManager.getToken();
        const response = await fetch(`${API_BASE_URL}/office/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Erro ao carregar perfil");

        const normalized: ProfileData = {
          owner_id: data.owner_id ?? null,
          personal: {
            id: data.personal.id,
            name: data.personal.name,
            username: data.personal.username ?? null,
            date_of_birth: data.personal.date_of_birth
              ? new Date(data.personal.date_of_birth)
              : null,
            gender: data.personal.gender ?? null,
            profession: data.personal.profession ?? "",
            tax_id: data.personal.tax_id ?? data.personal.document ?? "",
          },
          contact: {
            email: data.contact?.email ?? "",
            phone_number: data.contact?.phone_number ?? "",
          },
          address: {
            postal_code: data.address?.postal_code ?? null,
            address: data.address?.address ?? null,
            number: data.address?.number ?? null,
            state: data.address?.state ?? null,
            city: data.address?.city ?? null,
            country: data.address?.country ?? null,
            neighborhood: data.address?.neighborhood ?? null,
            complement: data.address?.complement ?? null,
          },
        };

        setProfileData(normalized);
        calculateAndSetCompletion(normalized);
      } catch (err) {
        //console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [calculateAndSetCompletion]);

  // Atualizar o percentual quando os dados mudarem
  useEffect(() => {
    calculateAndSetCompletion(profileData);
  }, [profileData, calculateAndSetCompletion]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primarymobi border-gray-200 rounded-full animate-spin"></div>
      </div>
    );

  if (!profileData)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <svg
          className="w-12 h-12 text-red-500 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        <p className="text-red-600 font-semibold text-lg">
          Não foi possível carregar os dados do usuário.
        </p>
        <p className="text-gray-400 text-sm">
          Tente atualizar a página ou contate o suporte se o problema persistir.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col items-end justify-center gap-6 relative flex-1 self-stretch grow">
      <Card className="w-full min-h-[70px] bg-primaryblack rounded-lg overflow-hidden border-0">
        <CardContent className="flex flex-col items-start justify-start gap-6 px-4">
          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-40 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
              Meu perfil
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between relative self-stretch w-full flex-[0_0_auto] gap-4 md:gap-0">
            <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
              <div
                className="flex flex-col items-center justify-center gap-1 relative self-stretch aspect-[1.05]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/path-to-avatar" />
                  <AvatarFallback className="bg-[#C0C0C0] border-[#C0C0C0] text-[#121212]">
                    {getInitials(profileData.personal.name)}
                  </AvatarFallback>
                </Avatar>

                {isHovered && (
                  <div className="inline-flex items-start gap-2 px-2 py-1 absolute top-[45px] bg-[#12121226] rounded-[99px] backdrop-blur-[2.95px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2.95px)_brightness(100%)]">
                    <Button className="w-4 h-4 bg-transparent p-0 border-0 hover:bg-transparent">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button className="w-4 h-4 bg-transparent p-0 border-0 hover:bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-h1 font-[number:var(--h1-font-weight)] text-white text-[14px] md:text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] whitespace-nowrap [font-style:var(--h1-font-style)]">
                  {user.name}
                </div>

                <div className="relative w-fit font-h3 font-[number:var(--h3-font-weight)] text-greyscale-30 text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                  {profileData.personal.username}
                </div>

                <div className="relative w-fit [font-family:'Epilogue-Regular',Helvetica] font-normal text-greyscale-50 text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                  {maskCPF(profileData.personal.tax_id)}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] lg:ml-auto">
              <Award className="w-6 h-6 text-[#947E3D]" />
              <div className="relative w-fit font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                Membro desde 2024
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 grow bg-primaryblack min-h-[70px] rounded-lg overflow-hidden border-0 w-full">
        <CardContent className="flex flex-col items-start gap-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="flex items-start gap-4 self-stretch w-full bg-transparent p-0 h-auto">
              {tabsData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col items-center justify-center gap-2.5 px-0 py-1 relative 
                    flex-1 grow border-b [border-bottom-style:solid] text-white 
                    data-[state=inactive]:border-greyscale-70 data-[state=inactive]:text-greyscale-50
                    data-[state=active]:bg-[#ff842a1a] data-[state=active]:border-primarymobi"
                >
                  <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                    {tab.label}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal" className="mt-6 space-y-6">
              <ProgressCard completedPercentage={completedPercentage} />
              <PerfilPersonalTab
                personalData={profileData?.personal ?? null}
                setPersonalData={(newData) =>
                  setProfileData((prev) =>
                    prev ? { ...prev, personal: newData } : null
                  )
                }
                errors={errors}
              />
              <AlterarSenhaDialog />
            </TabsContent>

            <TabsContent value="contact" className="mt-6 space-y-6">
              <ProgressCard completedPercentage={completedPercentage} />

              <PerfilContactTab
                contactData={profileData?.contact}
                setContactData={(newData) =>
                  setProfileData((prev) =>
                    prev ? { ...prev, contact: newData } : null
                  )
                }
              />
            </TabsContent>

            <TabsContent value="address" className="mt-6 space-y-6">
              <ProgressCard completedPercentage={completedPercentage} />
              <PerfilAddressTab
                addressData={profileData?.address}
                setAddressData={(newData) =>
                  setProfileData((prev) =>
                    prev ? { ...prev, address: newData } : null
                  )
                }
                errors={errors}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end w-full mt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primarymobi text-white px-6 py-2 rounded"
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
