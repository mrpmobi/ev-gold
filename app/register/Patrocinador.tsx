interface PatrocinadorProps {
  nome: string;
  isDarkMode: boolean;
}

export default function Patrocinador({ nome, isDarkMode }: PatrocinadorProps) {
  return (
    <div
      className={`mb-4 text-center ${
        isDarkMode ? "text-gray-300" : "text-gray-600"
      }`}
    >
      <p>
        Associando-se ao patrocinador: <br />
        <strong>{nome}</strong>
      </p>
    </div>
  );
}
