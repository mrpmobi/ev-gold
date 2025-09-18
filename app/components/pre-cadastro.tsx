"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, User, MapPin, Briefcase, LogOut, CheckCircle } from "lucide-react"

interface PreCadastroComponentProps {
  userEmail: string
  onLogout: () => void
}

export default function PreCadastroComponent({ userEmail, onLogout }: PreCadastroComponentProps) {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    estado: "",
    experiencia: "",
    motivacao: "",
    termos: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envio do formulário
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Tracking do Meta Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "Lead")
    }

    setIsSubmitted(true)
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <Card className="shadow-xl text-center">
            <CardContent className="pt-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
              <p className="text-gray-600 mb-6">
                Obrigado por se cadastrar como consultor MRP Mobi. Em breve entraremos em contato!
              </p>
              <Button onClick={onLogout} variant="outline" className="w-full bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header com logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MRP Mobi</h1>
            <p className="text-lg text-gray-600">Pré-cadastro de Consultores</p>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Boas-vindas */}
        <Alert className="mb-6">
          <User className="h-4 w-4" />
          <AlertDescription>
            Bem-vindo(a), <strong>{userEmail}</strong>! Complete seu cadastro para se tornar um consultor MRP Mobi.
          </AlertDescription>
        </Alert>

        {/* Formulário */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Complete seu Cadastro</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para finalizar seu cadastro como consultor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados Pessoais
                </h3>

                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                      required
                      className="pl-10 mt-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="cidade"
                        type="text"
                        placeholder="Sua cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange("cidade", e.target.value)}
                        required
                        className="pl-10 mt-1"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select onValueChange={(value) => handleInputChange("estado", value)} disabled={isLoading}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Experiência Profissional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Experiência Profissional</h3>

                <div>
                  <Label htmlFor="experiencia">Experiência em Consultoria</Label>
                  <Select onValueChange={(value) => handleInputChange("experiencia", value)} disabled={isLoading}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione sua experiência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante (0-1 anos)</SelectItem>
                      <SelectItem value="intermediario">Intermediário (2-5 anos)</SelectItem>
                      <SelectItem value="avancado">Avançado (5+ anos)</SelectItem>
                      <SelectItem value="sem-experiencia">Sem experiência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="motivacao">Por que deseja ser um consultor MRP Mobi?</Label>
                  <Textarea
                    id="motivacao"
                    placeholder="Conte-nos sobre sua motivação..."
                    value={formData.motivacao}
                    onChange={(e) => handleInputChange("motivacao", e.target.value)}
                    className="mt-1 min-h-[100px]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termos"
                  checked={formData.termos}
                  onCheckedChange={(checked) => handleInputChange("termos", checked as boolean)}
                  required
                  disabled={isLoading}
                />
                <Label htmlFor="termos" className="text-sm leading-5">
                  Aceito os termos de uso e política de privacidade da MRP Mobi. Concordo em receber comunicações sobre
                  oportunidades de consultoria.
                </Label>
              </div>

              {/* Botão de Envio */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={!formData.termos || isLoading}
              >
                {isLoading ? "Enviando..." : "Finalizar Cadastro"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>© 2024 MRP Mobi. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
