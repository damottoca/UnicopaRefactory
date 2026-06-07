import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import DiaCard from "../app/components/DiaCard";
import copaData from "../app/assets/data/copaData.json";

import {
  groupGameByDate,
  filtraFavoritos,
} from "../app/utils/GroupGames";

export default function HomeScreen() {
  const [jogos, setJogos] = useState([]);
  const [dados, setDados] = useState([]);
  const [favoritos, setFavoritos] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    const lista = copaData.jogos.map((j) => ({
      ...j,
      isfavorito: false,
    }));

    setJogos(lista);
    setDados(groupGameByDate(lista));
  }

  function atualizarFavorito(id) {
    const atualizado = jogos.map((j) =>
      j.id === id
        ? { ...j, isfavorito: !j.isfavorito }
        : j
    );

    setJogos(atualizado);
    setDados(groupGameByDate(atualizado));
  }

  const exibicao = favoritos
    ? filtraFavoritos(dados)
    : dados;

  if (!jogos.length) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: "#fff" }}>
          Nenhum jogo carregado
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UNICOPA 2026</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => setFavoritos(!favoritos)}
      >
        <Text style={{ color: "#000" }}>
          {favoritos
            ? "Ver todos"
            : "Ver favoritos"}
        </Text>
      </TouchableOpacity>

      <ScrollView>
        {exibicao.map((section) => (
          <DiaCard
            key={section.title}
            section={section}
            atualizaJogoMemoria={atualizarFavorito}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#26da9e",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});