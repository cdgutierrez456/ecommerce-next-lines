export const patterns = {
  EMAIL: '(^[\\w.%+-]{1,})@(([\\w-]{2,}\\.)+)([\\w]{2,})',
  ONLY_NUMBERS: '([0-9]+)',
  ONLY_NUMBERS_WITH_DOTS: '([0-9.,]+)',
  CARD_NUMBERS: '([0-9 ]+)',
  PERCENTAGE: '([0-9.,]+)',
  LETTERS_AND_NUMBERS_WITHOUT_SPACE: '([a-zñA-ZÑ0-9]+)',
  LETTERS_AND_NUMBERS: '([a-zñA-ZÑ0-9ÁÉÍÓÚáéíóú ]+)',
  ONLY_LETTERS_AND_SPACE: '([a-zñA-ZÑÁÉÍÓÚáéíóú ]+)',
  ALL_VALID_CHARACTERES: '([a-zA-ZáéíóúÁÉÍÓÚäëöïüÄËÏÖÜÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ0-9 .;:,&_ñÑ#%*@$!|"¿?/\n+¡=-]+)',
  WEB_PAGE: '^www.[a-z\\.\\-]+\\/?\S+',
};
