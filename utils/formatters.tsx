export const formatCpf = (value: string): string => {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);
  return onlyNumbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatCel = (value: string): string => {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);
  return onlyNumbers
    .replace(/(\d{0})(\d)/, "$1($2")
    .replace(/(\d{2})(\d)/, "$1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

export const formatCep = (value: string): string => {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
  return onlyNumbers.replace(/(\d{5})(\d)/, "$1-$2");
};

export const formatName = (value: string): string => {
  return value.replace(/[^a-zA-Zà-úÀ-Ú\s]/g, "");
};

export function formatMoney(value: string | number): string {
  const number =
    typeof value === "string"
      ? parseFloat(value.replace(",", "."))
      : value;

  if (isNaN(number)) return "R$ 0,00";

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDate(dateString: string): string {
  if (!dateString) {
    return "";
  }

  const partes = dateString.substring(0, 10).split("-");
  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];

  return `${dia}/${mes}/${ano}`;
}

export function formatDateMobile(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

export function formatDateSlash(dateString: string): string {
  if (!dateString) {
    return "";
  }

  const partes = dateString.substring(0, 10).split("/");
  const dia = partes[0];
  const mes = partes[1];
  const ano = partes[2];

  return `${dia}/${mes}/${ano}`;
}

export function formatDateSlashMobile(dateString: string): string {
  if (!dateString) {
    return "";
  }

  const partes = dateString.substring(0, 10).split("/");
  const dia = partes[0];
  const mes = partes[1];
  const ano = partes[2].slice(-2);

  return `${dia}/${mes}/${ano}`;
}
