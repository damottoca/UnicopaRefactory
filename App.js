import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
  SectionList,
} from "react-native";
import copaData from "./app/assets/data/copaData.json";
import { useEffect, useState } from "react";
import DiaCard from "./app/components/DiaCard";
import {
  groupGameByDate,
  groupGameByDateAndGroup,
} from "./app/utils/GroupGames";
import { supabase } from "./app/utils/supabase";

export default function App() {
  const [jogos, setJogos] = useState([]);
  const [jogosFil, setJogosFiltrados] = useState([]);
  const [dadosCopa, setDadosCopa] = useState(copaData);
  const [groupSelected, setGroupSelected] = useState("");

  useEffect(() => {
    async function carregarJogos() {
      const { data, error } = await supabase.from("jogos").select("*");
      if (!error && data) {
        setJogos(data);
      }
    }
    carregarJogos();
  }, []);

  useEffect(() => {
    if (!jogos || jogos.length === 0) return;

    if (!groupSelected || groupSelected.trim() === "") {
      setJogosFiltrados(groupGameByDate(jogos));
    } else {
      setJogosFiltrados(
        groupGameByDateAndGroup(jogos, groupSelected.toUpperCase()),
      );
    }
  }, [groupSelected, jogos]);

  return (
    <ImageBackground
      style={styles.container}
      source={require("./app/assets/bg-overlay.png")}
    >
      <Image style={styles.logo} source={require("./app/assets/unicopa.png")} />
      <Text style={styles.title}>CALENDÁRIO</Text>
      <TextInput
        style={styles.searchGroup}
        placeholderTextColor={"#9c9b9b"}
        textAlign="center"
        placeholder="Procurar por grupo"
        onChangeText={(text) => setGroupSelected(text)}
        value={groupSelected}
        maxLength={1}
      />
      <SectionList
        sections={jogosFil}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={() => null}
        renderSectionHeader={({ section }) => <DiaCard section={section} />}
        style={styles.listGames}
      />
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
});
