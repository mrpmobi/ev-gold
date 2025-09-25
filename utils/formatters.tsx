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
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;

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

  let separador = "-";
  if (dateString.includes("/")) separador = "/";
  const partes = dateString.substring(0, 10).split(separador);
  let ano = partes[0];
  const mes = partes[1];
  let dia = partes[2];

  if (dateString.includes("/")){
    ano = partes[2];
    dia = partes[0];
  }

  return `${dia}/${mes}/${ano}`;
}

export function formatDateMobile(dateString: string): string {
   if (!dateString) {
    return "";
  }

  let separador = "-";
  if (dateString.includes("/")) separador = "/";
  const partes = dateString.substring(0, 10).split(separador);
  let ano = partes[0].slice(-2);
  const mes = partes[1];
  let dia = partes[2];

  if (dateString.includes("/")){
    ano = partes[2].slice(-2);
    dia = partes[0];
  }

  return `${dia}/${mes}/${ano}`;
}

export function parseCustomDateFormat(dateString: string): string {
  // Split the date and time parts
  const [datePart, timePart] = dateString.split(' ');
  
  // Split date into day, month, year
  const [day, month, year] = datePart.split('/').map(Number);
  
  // Split time into hours and minutes
  const [hours, minutes] = timePart.split(':').map(Number);

  // Create a new Date object
  // Note: month is 0-indexed in Date constructor, so subtract 1
  return new Date(year, month - 1, day, hours, minutes).toISOString();
}
