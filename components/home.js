import React from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
      this.setState({
        nome: user.displayName || '',
        email: user.email || '',
      });
    }
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../assets/background.jpeg')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Camada escura para contraste */}
          <View style={styles.overlay}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Cabeçalho */}
              <View style={styles.header}>
                <Text style={styles.saudacao}>Bem-vindo,</Text>
                <Text style={styles.nomeUsuario}>{this.state.nome}</Text>
              </View>

              {/* Grid principal */}
              <View style={styles.gridContainer}>
                {/* Bloco grande - Treino */}
                <TouchableOpacity 
                  style={[styles.bloco, styles.blocoTreino]} 
                  onPress={() => this.props.navigation.navigate('Treino')}
                >
                  <Feather name="activity" size={40} color="#fff" />
                  <Text style={styles.textoBloco}>Treino</Text>
                </TouchableOpacity>

                {/* Linha inferior */}
                <View style={styles.linhaInferior}>
                  {/* Hidratação */}
                  <TouchableOpacity 
                    style={[styles.bloco, styles.blocoHidratacao]} 
                    onPress={() => this.props.navigation.navigate('Hidratacao')}
                  >
                    <Feather name="droplet" size={36} color="#fff" />
                    <Text style={styles.textoBloco}>Hidratação</Text>
                  </TouchableOpacity>

                  {/* Coluna da direita */}
                  <View style={styles.colunaDireita}>
                    {/* Alimentação */}
                    <TouchableOpacity 
                      style={[styles.bloco, styles.blocoAlimentacao]} 
                      onPress={() => this.props.navigation.navigate('Alimentacao')}
                    >
                      <Feather name="coffee" size={36} color="#fff" />
                      <Text style={styles.textoBloco}>Alimentação</Text>
                    </TouchableOpacity>

                    {/* Perfil */}
                    <TouchableOpacity 
                      style={[styles.bloco, styles.blocoPerfil]} 
                      onPress={() => this.props.navigation.navigate('Perfil')}
                    >
                      <Feather name="user" size={36} color="#fff" />
                      <Text style={styles.textoBloco}>Perfil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Escurece o fundo
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 45,
    height: '100%',
  },
  header: {
    marginBottom: 20,
  },
  saudacao: {
    color: '#B3B3B3',
    fontSize: 18,
  },
  nomeUsuario: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
    height: '100%',
  },
  linhaInferior: {
    height:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colunaDireita: {
    width: '47%',
    justifyContent: 'space-betwen',
  },
  bloco: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 5 },
    elevation: 8,
    marginBottom: 15,
    backgroundColor: 'rgba(60, 60, 60, 0.8)', // cinza translúcido
    paddingVertical: 20,
  },
  textoBloco: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  blocoTreino: {
    width: '100%',
    height: '25%',
  },
  blocoHidratacao: {
    width: '47%',
    height: '65%',
  },
  blocoAlimentacao: {
    height: '32%',
  },
  blocoPerfil: {
    height: '31%',
  },
});
