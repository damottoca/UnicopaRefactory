import { supabase } from "./supabase";
import copaData from "../assets/data/copaData.json";

export async function importarJogos() {
  const jogos = copaData.jogos;

  const { data: existentes } = await supabase
    .from("jogos")
    .select("id");

  const ids = existentes?.map((j) => j.id) || [];

  const novos = jogos.filter(
    (jogo) => !ids.includes(jogo.id)
  );

  const { error } = await supabase
    .from("jogos")
    .insert(novos);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
}