import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from '../config/config'

export default class CadastroScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      nome: undefined,
      user: undefined,
      senha: undefined,
    }
  }

  gravar(){
    const email = this.state.user;
    const senha = this.state.senha;

    firebase.auth().createUserWithEmailAndPassword(email, senha).then(() => {
        alert('Usuário cadastrado com sucesso!');
        this.props.navigation.navigate('Main');
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode == "auth/email-already-in-use") {
          console.log("Esse email já está em uso");
          Alert.alert('Erro', "Esse email já está em uso");
        } else if (errorCode == "auth/weak-password") {
          console.log("Senha fraca");
          Alert.alert('Erro', "Senha fraca, digite outra senha");
        } else if (errorCode == "auth/invalid-email") {
          console.log("Formato do email invalido");
          Alert.alert('Erro', "Formato do email invalido");
        } else {
          console.log("Erro Desconhecido");
          Alert.alert('Erro', "Ocorreu um erro" + error.message);
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={this.state.nome}
          onChangeText={(text) => this.setState({ nome: text })}
        />

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

        <TouchableOpacity style={styles.button} onPress={() => this.gravar()}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
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