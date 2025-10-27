// src/config/worldcup.js
// Clasificados confirmados a la Copa del Mundo 2026 (oct 2025) — versión español.

const QUALIFIED_2026_ES = {
  hosts: ["Canadá", "México", "Estados Unidos"],
  afc: [
    "Australia",
    "Irán",
    "Japón",
    "Jordania",
    "Catar",
    "Arabia Saudita",
    "Corea del Sur",
    "Uzbekistán",
  ],
  caf: [
    "Argelia",
    "Cabo Verde",
    "Egipto",
    "Ghana",
    "Costa de Marfil",
    "Marruecos",
    "Senegal",
    "Sudáfrica",
    "Túnez",
  ],
  concacaf: [],
  conmebol: ["Argentina", "Brasil", "Colombia", "Ecuador", "Paraguay", "Uruguay"],
  uefa: ["Inglaterra"],
  ofc: ["Nueva Zelanda"],
};

function buildQualifiedSetES() {
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();

  const all = [
    ...QUALIFIED_2026_ES.hosts,
    ...QUALIFIED_2026_ES.afc,
    ...QUALIFIED_2026_ES.caf,
    ...QUALIFIED_2026_ES.concacaf,
    ...QUALIFIED_2026_ES.conmebol,
    ...QUALIFIED_2026_ES.uefa,
    ...QUALIFIED_2026_ES.ofc,
  ];
  return new Set(all.map(normalize));
}

module.exports = { QUALIFIED_2026_ES, buildQualifiedSetES };
