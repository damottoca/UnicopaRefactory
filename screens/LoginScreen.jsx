import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native'

import { useState } from 'react'

import { supabase } from '../utils/supabase'

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function fazerLogin() {

    if (!email || !senha) {

      Alert.alert(
        'Erro',
        'Preencha todos os campos'
      )

      return
    }

    const emailValido =
      /\S+@\S+\.\S+/.test(email)

    if (!emailValido) {

      Alert.alert(
        'Erro',
        'Digite um e-mail válido'
      )

      return
    }

    const { error } =
      await supabase.auth.signInWithPassword({

        email,
        password: senha

      })

    if (error) {

      Alert.alert(
        'Erro',
        'E-mail ou senha inválidos'
      )

      return
    }

    navigation.navigate('Home')

  }

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        LOGIN
      </Text>

      <TextInput
        style={styles.input}
        placeholder='E-mail'
        placeholderTextColor='#999'
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder='Senha'
        placeholderTextColor='#999'
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={fazerLogin}
      >

        <Text style={styles.textoBotao}>
          Entrar
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Registrar')
        }
      >

        <Text style={styles.link}>
          Criar conta
        </Text>

      </TouchableOpacity>

    </View>

  )

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#040b13'
  },

  titulo: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40
  },

  input: {
    backgroundColor: '#0c1b2a',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },

  botao: {
    backgroundColor: '#f2cc2f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  textoBotao: {
    fontWeight: 'bold'
  },

  link: {
    color: '#f2cc2f',
    marginTop: 20,
    textAlign: 'center'
  }

})