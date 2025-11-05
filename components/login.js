import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import firebase from '../config/config'; 

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: '',
      senha: ''
    }
  }

  ler() {
    const email = this.state.user.toLowerCase();
    const senha = this.state.senha;

    firebase.auth().signInWithEmailAndPassword(email, senha).then(() => {
        Alert.alert("Sucesso", "Login realizado!");
        this.props.navigation.navigate('Main');
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          Alert.alert("Erro","Usuário não encontrado");
        } else if (errorCode === 'auth/wrong-password'){
          Alert.alert("Erro", "Senha incorreta");
        } else if (errorCode == "auth/invalid-email"){
          Alert.alert("Formato do email inválido");
        } else{
          Alert.alert('Erro', 'Erro ao fazer login: ' + error.message);
        }
      });
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/FundoLogin.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>

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

            <TouchableOpacity style={styles.button} onPress={() => this.ler()}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Cadastro')}>
              <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)', // escurece a imagem
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 40, 40, 0.8)', // translúcido no tom da home
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
