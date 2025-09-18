export function maskCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2*.***-$4").replace(/(\d{3})\.(\d{2})\*/, "$1.$2*"); // Ajusta para manter o asterisco após os 2 dígitos
}
