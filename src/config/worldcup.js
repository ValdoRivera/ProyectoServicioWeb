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
  concacaf: ["Panamá", "Curazao", "Haití"],
  conmebol: ["Argentina", "Brasil", "Colombia", "Ecuador", "Paraguay", "Uruguay"],
  uefa: [
    "Austria",
    "Bélgica",
    "Croacia",
    "Inglaterra",
    "Francia",
    "Alemania",
    "Países Bajos",
    "Noruega",
    "Portugal",
    "Escocia",
    "España",
    "Suiza",
  ],
  ofc: ["Nueva Zelanda"],

  repechaje_intercontinental: [
    "Bolivia",
    "República Democrática del Congo",
    "Irak",
    "Jamaica",
    "Nueva Caledonia",
    "Surinam",
  ],

  repechaje_europeo: [
    "Albania",
    "Bosnia y Herzegovina",
    "República Checa",
    "Dinamarca",
    "Italia",
    "Kosovo",
    "Polonia",
    "República de Irlanda",
    "Eslovaquia",
    "Turquía",
    "Ucrania",
    "Gales",
    "Rumanía",
    "Suecia",
    "Irlanda del Norte",
    "Macedonia del Norte",
  ],
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