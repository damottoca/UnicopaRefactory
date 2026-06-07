import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { supabase } from "../app/utils/supabase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function cadastrar() {
    const { error } =
      await supabase.auth.signUp({
        email,
        password: senha,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Conta criada!");
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={cadastrar}
      >
        <Text style={{ color: "#fff" }}>
          Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  btn: {
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
  },
});