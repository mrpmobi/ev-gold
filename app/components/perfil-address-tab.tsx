import { LabelInput } from "./label-input";
import { formatCep } from "@/utils/formatters";
import { LabelSelect } from "./label-select";
import { useEffect, useState } from "react";
import { ProfileData } from "@/types/profile";

const estadosBrasileiros = [
  { value: "ac", label: "Acre", sigla: "AC" },
  { value: "al", label: "Alagoas", sigla: "AL" },
  { value: "ap", label: "Amapá", sigla: "AP" },
  { value: "am", label: "Amazonas", sigla: "AM" },
  { value: "ba", label: "Bahia", sigla: "BA" },
  { value: "ce", label: "Ceará", sigla: "CE" },
  { value: "df", label: "Distrito Federal", sigla: "DF" },
  { value: "es", label: "Espírito Santo", sigla: "ES" },
  { value: "go", label: "Goiás", sigla: "GO" },
  { value: "ma", label: "Maranhão", sigla: "MA" },
  { value: "mt", label: "Mato Grosso", sigla: "MT" },
  { value: "ms", label: "Mato Grosso do Sul", sigla: "MS" },
  { value: "mg", label: "Minas Gerais", sigla: "MG" },
  { value: "pa", label: "Pará", sigla: "PA" },
  { value: "pb", label: "Paraíba", sigla: "PB" },
  { value: "pr", label: "Paraná", sigla: "PR" },
  { value: "pe", label: "Pernambuco", sigla: "PE" },
  { value: "pi", label: "Piauí", sigla: "PI" },
  { value: "rj", label: "Rio de Janeiro", sigla: "RJ" },
  { value: "rn", label: "Rio Grande do Norte", sigla: "RN" },
  { value: "rs", label: "Rio Grande do Sul", sigla: "RS" },
  { value: "ro", label: "Rondônia", sigla: "RO" },
  { value: "rr", label: "Roraima", sigla: "RR" },
  { value: "sc", label: "Santa Catarina", sigla: "SC" },
  { value: "sp", label: "São Paulo", sigla: "SP" },
  { value: "se", label: "Sergipe", sigla: "SE" },
  { value: "to", label: "Tocantins", sigla: "TO" },
];

interface PerfilAddressTabProps {
  addressData: ProfileData["address"];
  setAddressData: (data: ProfileData["address"]) => void;
  errors?: Record<string, string>;
}

export function PerfilAddressTab({ addressData, setAddressData, errors = {} }: PerfilAddressTabProps) {
  const [cidadesOptions, setCidadesOptions] = useState<{ value: string; label: string }[]>([]);

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setAddressData({
          ...addressData,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf ? data.uf.toLowerCase() : '',
          postal_code: formatCep(cleanedCep)
        });
      } else {
        alert('CEP não encontrado');
      }
    } catch (error) {
      //console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar CEP');
    }
  };

  // Carregar cidades do IBGE quando o estado muda
  useEffect(() => {
    if (!addressData.state) {
      setCidadesOptions([]);
      return;
    }
  
    const carregarCidades = async () => {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${addressData.state?.toLowerCase()}/municipios`
        );
        if (!response.ok) throw new Error("Falha ao carregar cidades");

        const data = await response.json();
        const cidades = data.map((c: { nome: string }) => ({ value: c.nome, label: c.nome }));
        setCidadesOptions(cidades);
      } catch {
        setCidadesOptions([]);
      }
    };

    carregarCidades();
  }, [addressData.state]);

  return (
    <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
      <div className="relative w-fit mt-[-1.00px] font-h2 text-greyscale-40">
        Dados de endereço
      </div>

      <div className="flex items-start gap-4 self-stretch w-full relative flex-[0_0_auto]">
        <LabelInput
          id="postal_code"
          name="postal_code"
          value={addressData.postal_code ?? ""}
          onChange={(e) => {
            const formattedCep = formatCep(e.target.value);
            setAddressData({ ...addressData, postal_code: formattedCep });
          }}
          onBlur={(e) => fetchAddressByCep(e.target.value)}
          label="CEP"
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 self-stretch w-full relative flex-[0_0_auto]">
        <LabelInput
          id="address"
          name="address"
          value={addressData.address ?? ""}
          onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
          label="Rua/Logradouro"
          errors={errors}
        />
        <LabelInput
          id="neighborhood"
          name="neighborhood"
          value={addressData.neighborhood ?? ""}
          onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
          label="Bairro"
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 self-stretch w-full relative flex-[0_0_auto]">
        <LabelInput
          id="number"
          name="number"
          value={addressData.number ?? ""}
          onChange={(e) =>
            setAddressData({ ...addressData, number: e.target.value.replace(/\D/g, "") })
          }
          label="Número"
          errors={errors}
        />
        <LabelInput
          id="complement"
          name="complement"
          value={addressData.complement ?? ""}
          onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
          label="Complemento"
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 self-stretch w-full relative flex-[0_0_auto]">
        <LabelSelect
          id="state"
          label="Estado"
          value={addressData.state ?? ""}
          onValueChange={(value) => setAddressData({ ...addressData, state: value, city: "" })}
          options={estadosBrasileiros}
          errors={errors}
        />
        <LabelSelect
          id="city"
          label="Cidade"
          value={addressData.city ?? ""}
          onValueChange={(value) => setAddressData({ ...addressData, city: value })}
          options={cidadesOptions}
          errors={errors}
        />
      </div>
    </div>
  );
}