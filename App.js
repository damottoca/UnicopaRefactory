import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
  SectionList,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import copaData from "./app/assets/data/copaData.json";
import { useEffect, useState } from "react";
import DiaCard from "./app/components/DiaCard";
import {
  filtraFavoritos,
  groupGameByDate,
  groupGameByDateAndGroup,
} from "./app/utils/GroupGames";
import { supabase } from "./app/utils/supabase";

export default function App() {
  const [jogos, setJogos] = useState([]);
  const [jogosFil, setJogosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dadosCopa, setDadosCopa] = useState(copaData);
  const [groupSelected, setGroupSelected] = useState("");
  const [isFilterByFavList, setIsFilterByFavList] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function carregarJogos() {
      const { data, error } = await supabase
        .from("jogos")
        .select("*")
        .order("data_brasilia", { ascending: true });
      if (!error && data) {
        setJogos(data);
      }
    }
    carregarJogos();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!jogos || jogos.length === 0) return;

    if (!groupSelected || groupSelected.trim() === "") {
      setJogosFiltrados(groupGameByDate(jogos));
    } else {
      setJogosFiltrados(
        groupGameByDateAndGroup(jogos, groupSelected.toUpperCase()),
      );
    }

    if (isFilterByFavList) {
      setJogosFiltrados(filtraFavoritos(jogosFil));
    }
    setIsLoading(false);
  }, [groupSelected, jogos, isFilterByFavList]);

  function atualizaJogoMemoria(id) {
    const jogosAtualizados = jogos.map((item) =>
      item.id === id ? { ...item, isfavorito: !item.isfavorito } : item,
    );
    setJogos(jogosAtualizados);

    setJogosFiltrados(
      jogosFil.map((j) => ({
        ...j,
        data: j.data.map((jogo) =>
          jogo.id === id ? { ...jogo, isfavorito: !jogo.isfavorito } : jogo,
        ),
      })),
    );
  }

  async function inserirUsuario() {
    const { data, error } = await supabase.from("usuarios").insert([
      {
        nome: "Taffe",
        ra: "600000",
        email: "teste@teste.com",
        telefone: "(46) 99999-9999",
        senha: "123456",
        data_nascimento: "2001-01-01",
      },
    ]);
    if (!error) {
      console.log("Sucesso na criação do usuário");
    } else {
      console.log("Erro: " + error);
    }
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("./app/assets/bg-overlay.png")}
    >
      <Image style={styles.logo} source={require("./app/assets/unicopa.png")} />
      <Text style={styles.title}>CALENDÁRIO</Text>
      <TouchableOpacity
        onPress={() => {
          setIsFilterByFavList(!isFilterByFavList);
        }}
        style={styles.btnFavoritos}
      >
        <Image
          style={[styles.imgFavoritos, isFilterByFavList ? { height: 44 } : {}]}
          source={
            isFilterByFavList
              ? require("./app/assets/listaNormal.png")
              : require("./app/assets/listaFavorita.png")
          }
        />
      </TouchableOpacity>
      <TextInput
        style={styles.searchGroup}
        placeholderTextColor={"#9c9b9b"}
        textAlign="center"
        placeholder="Procurar por grupo"
        onChangeText={(text) => setGroupSelected(text)}
        value={groupSelected}
        maxLength={1}
      />
      {isLoading ? (
        <View style={styles.carregarCtn}>
          <Text style={styles.txtCarregar}> Carregando jogos...</Text>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : jogos.length === 0 ? (
        <View style={styles.carregarCtn}>
          <Text style={styles.txtCarregar}> Nenhum jogo carregado</Text>
        </View>
      ) : (
        <SectionList
          sections={jogosFil}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={() => null}
          renderSectionHeader={({ section }) => (
            <DiaCard
              atualizaJogoMemoria={atualizaJogoMemoria}
              section={section}
            />
          )}
          style={styles.listGames}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#040b13",
    alignItems: "center",
  },
  listGames: {
    marginTop: 25,
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  searchGroup: {
    color: "#fff",
    borderColor: "#8fa3b8",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    width: 220,
    height: 40,
  },
  carregarCtn: {
    flex: 1,
    alignContent: "center",
    marginTop: 120,
    gap: 15,
  },
  txtCarregar: {
    fontSize: 18,
    color: "#fff",
  },
  imgFavoritos: {
    height: 40,
    width: 40,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btnFavoritos: {
    position: "absolute",
    top: 120,
    left: "8%",
    alignContent: "center",
    justifyContent: "center",
    padding: 5,
  },
});
