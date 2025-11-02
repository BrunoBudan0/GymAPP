import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import firebase from '../config/config'; 

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: undefined,
      senha: undefined
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
          Alert.alert("Formato do email invalido");
        } else{
          Alert.alert('Erro', 'Erro ao fazer login: ' + error.message);
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.user}
          onChangeText={(text) => this.setState({ user: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16
  }
});