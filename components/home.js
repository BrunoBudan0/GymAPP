import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import firebase from '../config/config';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      email: ''
    };
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('usuarios/' + user.uid).once('value').then(snapshot => {
        const nome = snapshot.val()?.nome || '';
        this.setState({ nome });
      });
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.nomeUsuario}>{this.state.nome}</Text>
        </View>

        {/* Grid principal */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={[styles.bloco, styles.blocoTreino]} onPress={()=> this.props.navigation.navigate('Treino')}>
            <Text style={styles.textoBloco}>Treino</Text>
          </TouchableOpacity>

          {/* Blocos em duas colunas */}
          <View style={styles.linhaInferior}>
            <TouchableOpacity style={[styles.bloco, styles.blocoHidratacao]} onPress={()=> this.props.navigation.navigate('Hidratacao')}>
              <Text style={styles.textoBloco}>Hidratação</Text>
            </TouchableOpacity>

            {/* Coluna da direita */}
            <View style={styles.colunaDireita}>
              <TouchableOpacity style={[styles.bloco, styles.blocoAlimentacao]} onPress={()=> this.props.navigation.navigate('Alimentacao')}>
                <Text style={styles.textoBloco}>Alimentação</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.bloco, styles.blocoProgresso]} onPress={()=> this.props.navigation.navigate('Perfil')}>
                <Text style={styles.textoBloco}>Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    marginBottom: 30,
  },
  nomeUsuario: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
  },
  linhaInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colunaDireita: {
    width: '47%',
    justifyContent: 'space-between',
  },
  bloco: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    elevation: 5,
    marginBottom: 15,
  },
  textoBloco: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blocoTreino: {
    backgroundColor: '#1E90FF',
    width: '100%',
    height: 130,
    marginBottom: 15,
  },
  blocoHidratacao: {
    backgroundColor: '#00CED1',
    width: '47%',
    height: 280, // ocupa o espaço de dois blocos
  },
  blocoAlimentacao: {
    backgroundColor: '#32CD32',
    height: 130,
  },
  blocoProgresso: {
    backgroundColor: '#FF6347',
    height: 130,
  },
});
