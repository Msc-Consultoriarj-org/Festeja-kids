import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageCircle,
  MapPin,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const whatsappLink =
    "https://wa.me/5521999999999?text=Olá! Gostaria de saber mais sobre o Festeja Kids."; // Substituir pelo número real

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header Flutuante */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Festeja Kids
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#sobre" className="hover:text-pink-500 transition-colors">
              O Salão
            </a>
            <a
              href="#galeria"
              className="hover:text-pink-500 transition-colors"
            >
              Galeria
            </a>
            <a
              href="#localizacao"
              className="hover:text-pink-500 transition-colors"
            >
              Localização
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Área do Cliente
              </Button>
            </Link>
            <Button
              asChild
              className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 rounded-full"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530103862676-de3c9a59af38?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-6">
                O Melhor Salão da Zona Norte
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                Transforme o Sonho do <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Seu Filho em Realidade
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Espaço completo para até 200 convidados em Marechal Hermes.
                Especialistas em festas de 1 ano inesquecíveis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-xl shadow-pink-500/25"
                >
                  <Link href="/agendamento">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Visita Grátis
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-50"
                >
                  <a href="#galeria">Ver Fotos do Salão</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diferenciais (Stats) */}
      <section className="py-10 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Capacidade", value: "200 Pessoas" },
              { icon: MapPin, label: "Localização", value: "Marechal Hermes" },
              { icon: Star, label: "Avaliação", value: "5.0 Estrelas" },
              { icon: CheckCircle, label: "Experiência", value: "+500 Festas" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 text-pink-500">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="font-bold text-lg text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre o Salão */}
      <section id="sobre" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2rem] opacity-20 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop"
                alt="Interior do Salão Festeja Kids"
                className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/3]"
              />
              {/* Card Flutuante */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      Sucesso Total
                    </div>
                    <div className="text-xs text-slate-500">
                      Clientes 100% Satisfeitos
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "O melhor lugar para realizar o sonho da festa de 1 ano!"
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                O Cenário Perfeito para <br />
                <span className="text-pink-500">Momentos Mágicos</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Localizado no coração de Marechal Hermes, o Festeja Kids oferece
                uma infraestrutura completa para garantir o conforto e a
                diversão de todos os seus convidados.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Salão climatizado para até 200 pessoas",
                  "Área kids completa com brinquedão",
                  "Cozinha industrial equipada",
                  "Fraldário e banheiro acessível",
                  "Iluminação cênica e sistema de som",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
              >
                <Link href="/agendamento">Conhecer o Espaço</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Galeria de Festas
            </h2>
            <p className="text-slate-600">
              Inspire-se com algumas das lindas celebrações que já realizamos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              "https://images.unsplash.com/photo-1530103862676-de3c9a59af38?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519225448526-722609005f12?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1464349153912-bc6163bd8917?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop",
            ].map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl overflow-hidden shadow-md aspect-square"
              >
                <img
                  src={src}
                  alt={`Festa ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section id="localizacao" className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Venha nos Visitar
                </h2>
                <p className="text-slate-300 mb-8 text-lg">
                  Estamos localizados em um ponto estratégico da Zona Norte, com
                  fácil acesso para seus convidados.
                </p>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-pink-400 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Endereço</div>
                      <div className="text-slate-400">
                        Rua Sirici, 644 - Marechal Hermes
                        <br />
                        Rio de Janeiro - RJ
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-pink-400 flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Contato</div>
                      <div className="text-slate-400">
                        (21) 99999-9999
                        <br />
                        contato@festejakids.com.br
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 rounded-full w-full sm:w-auto"
                >
                  <a
                    href="https://maps.google.com/?q=Rua+Sirici+644+Marechal+Hermes"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir no Google Maps
                  </a>
                </Button>
              </div>
              <div className="h-96 md:h-auto bg-slate-800 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.368968612345!2d-43.36789092396598!3d-22.86267747931249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99630477777777%3A0x7777777777777777!2sR.%20Sirici%2C%20644%20-%20Marechal%20Hermes%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2021555-010!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 inline-block">
            Festeja Kids
          </div>
          <p className="text-slate-500 mb-8">
            © {new Date().getFullYear()} Festeja Kids. Todos os direitos
            reservados.
          </p>
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-pink-500 transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
