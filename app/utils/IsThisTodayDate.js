export function isThisDateToday(data) {
  const dateNow = new Date();
  const ano = dateNow.getFullYear();
  const mes = dateNow.getMonth() + 1;
  const dia = dateNow.getDate();
  const dataHoje = dia + "/" + mes + "/" + ano;
  return dataHoje == data;
}
