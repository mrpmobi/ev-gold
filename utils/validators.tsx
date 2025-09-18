export const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  const digito1 = resto === 10 ? 0 : resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  const digito2 = resto === 10 ? 0 : resto;

  return (
    parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2
  );
};
