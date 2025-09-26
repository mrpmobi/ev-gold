import { formatName } from "@/utils/formatters";
import { LabelInput } from "./label-input";
import { LabelSelect } from "./label-select";
import { DatePicker} from "./date-picker";
import { maskCPF } from "@/utils/masks";
import { ProfileData } from "@/types/profile";

interface PerfilPersonalTabProps {
  personalData: ProfileData["personal"] | null;
  setPersonalData: (data: ProfileData["personal"]) => void;
  errors?: Record<string, string>;
}

export function PerfilPersonalTab({
  personalData,
  setPersonalData,
  errors,
}: PerfilPersonalTabProps) {
  if (!personalData) return <div>Carregando dados pessoais...</div>;

  //const [gender, setGender] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "name") {
      newValue = formatName(value);
    }
    setPersonalData({
      ...personalData,
      [name]: newValue,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <LabelInput
        id="name"
        name="name"
        value={personalData.name}
        onChange={handleChange}
        label="Nome completo"
        errors={errors}
      />

      <LabelInput
        id="cpf"
        name="tax_id"
        value={maskCPF(personalData.tax_id)}
        onChange={handleChange}
        label="CPF"
        disabled
        errors={errors}
      />

      <LabelInput
        id="username"
        name="username"
        value={personalData.username || ""}
        onChange={handleChange}
        label="Nome de usuário"
        errors={errors}
      />

      <LabelInput
        id="profession"
        name="profession"
        value={personalData.profession}
        onChange={handleChange}
        label="Profissão"
        errors={errors}
      />

      <LabelSelect
        id="gender"
        label="Sexo"
        value={personalData.gender || ""}
        onValueChange={(val) =>
          setPersonalData({ ...personalData, gender: val })
        }
        options={[
          { value: "masculino", label: "Masculino" },
          { value: "feminino", label: "Feminino" },
        ]}
        errors={errors}
      />

      <DatePicker
        id="date_of_birth"
        label="Data de nascimento"
        dateValue={
          personalData.date_of_birth
            ? personalData.date_of_birth
            : null
        }
        onDateChange={(date) =>
          setPersonalData({
            ...personalData,
            date_of_birth: date ? date : null,
          })
        }
        errors={errors}
      />
    </div>
  );
}
