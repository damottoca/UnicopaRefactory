import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { supabase } from "../app/utils/supabase";

export default function PalpitesScreen() {
  const [jogos, setJogos] = useState([]);
  const [palpites, setPalpites] = useState({});

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await supabase
      .from("jogos")
      .select("*");

    setJogos(data);
  }

  async function salvar(jogoId) {
    const { data: user } =
      await supabase.auth.getUser();

    await supabase.from("palpites").upsert({
      user_id: user.user.id,
      jogo_id: jogoId,
      gols_casa:
        palpites[jogoId]?.casa || 0,
      gols_fora:
        palpites[jogoId]?.fora || 0,
      confirmado: true,
    });
  }

  return (
    <View>
      {jogos.map((jogo) => (
        <View key={jogo.id}>
          <Text>{jogo.confronto}</Text>

          <TextInput
            placeholder="Casa"
            onChangeText={(v) =>
              setPalpites({
                ...palpites,
                [jogo.id]: {
                  ...palpites[jogo.id],
                  casa: v,
                },
              })
            }
          />

          <TextInput
            placeholder="Fora"
            onChangeText={(v) =>
              setPalpites({
                ...palpites,
                [jogo.id]: {
                  ...palpites[jogo.id],
                  fora: v,
                },
              })
            }
          />

          <TouchableOpacity
            onPress={() => salvar(jogo.id)}
          >
            <Text>Salvar palpite</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}