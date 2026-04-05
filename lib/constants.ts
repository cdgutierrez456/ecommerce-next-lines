export interface DocumentType {
  idDT: number;
  nameDT: string;
  abbreviationDT: string;
  value: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    idDT: 1,
    nameDT: "CÉDULA DE CIUDADANÍA",
    abbreviationDT: "CC",
    value: "CedulaDeCiudadania",
  },
  {
    idDT: 2,
    nameDT: "TARJETA DE IDENTIDAD",
    abbreviationDT: "TI",
    value: "TarjetaDeIdentidad",
  },
  {
    idDT: 3,
    nameDT: "PASAPORTE",
    abbreviationDT: "PA",
    value: "Pasaporte",
  },
  {
    idDT: 4,
    nameDT: "NIT",
    abbreviationDT: "NIT",
    value: "NIT",
  },
];
