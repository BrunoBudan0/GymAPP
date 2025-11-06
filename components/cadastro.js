import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import firebase from '../config/config';

export default class CadastroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      user: '',
      senha: '',
    };
  }

  gravar() {
  const nome = this.state.nome.trim();
  const email = this.state.user.trim().toLowerCase();
  const senha = this.state.senha.trim();

  if (!nome || !email || !senha) {
    Alert.alert('Erro', 'Preencha todos os campos');
    return;
  }

  firebase.auth()
    .createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      const user = userCredential.user;

      // Atualiza o nome no perfil do usuário (Auth)
      return user.updateProfile({ displayName: nome })
        .then(() => {
          // Salva dados adicionais no Realtime Database
          return firebase.database().ref(`users/${user.uid}`).set({
            nome: nome,
            email: email,
            criadoEm: new Date().toISOString(),
          });
        });
    })
    .then(() => {
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      this.setState({ nome: '', user: '', senha: '' });
      this.props.navigation.navigate('Main'); // ou 'Home', conforme seu fluxo
    })
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode === "auth/email-already-in-use") {
        Alert.alert('Erro', "Esse email já está em uso");
      } else if (errorCode === "auth/weak-password") {
        Alert.alert('Erro', "Senha fraca, digite outra senha");
      } else if (errorCode === "auth/invalid-email") {
        Alert.alert('Erro', "Formato do email inválido");
      } else {
        Alert.alert('Erro', "Ocorreu um erro: " + error.message);
      }
    });
}

  render() {
    return (
      <ImageBackground
        source={require('../assets/FundoCadastro.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Crie sua conta para começar</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#ccc"
              value={this.state.nome}
              onChangeText={(text) => this.setState({ nome: text })}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#ccc"
              value={this.state.user}
              onChangeText={(text) => this.setState({ user: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#ccc"
              value={this.state.senha}
              onChangeText={(text) => this.setState({ senha: text })}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={() => this.gravar()}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.link}>Já tem conta? Faça login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
