import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

export default function TreinosScreen({ navigation }) {
  const [treinos, setTreinos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTreino, setNovoTreino] = useState('');
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    try {
      const dados = await AsyncStorage.getItem('treinos');
      if (dados) setTreinos(JSON.parse(dados));
    } catch (error) {
      console.log(error);
    }
  };

  const salvarTreinos = async (lista) => {
    try {
      await AsyncStorage.setItem('treinos', JSON.stringify(lista));
    } catch (error) {
      console.log(error);
    }
  };

  const adicionarTreino = () => {
    if (!novoTreino.trim()) {
      Alert.alert('Erro', 'Digite um nome para o treino');
      return;
    }

    let listaAtualizada;
    if (editando !== null) {
      listaAtualizada = treinos.map((t, i) =>
        i === editando ? { ...t, nome: novoTreino } : t
      );
      setEditando(null);
    } else {
      listaAtualizada = [...treinos, { nome: novoTreino, exercicios: [] }];
    }

    setTreinos(listaAtualizada);
    salvarTreinos(listaAtualizada);
    setNovoTreino('');
    setModalVisible(false);
  };

  const excluirTreino = (index) => {
    Alert.alert('Excluir treino', 'Deseja realmente excluir este treino?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        onPress: () => {
          const lista = treinos.filter((_, i) => i !== index);
          setTreinos(lista);
          salvarTreinos(lista);
        },
        style: 'destructive'
      },
    ]);
  };

  const editarTreino = (index) => {
    setNovoTreino(treinos[index].nome);
    setEditando(index);
    setModalVisible(true);
  };

  const iniciarTreino = (index) => {
    navigation.navigate('iniciarTreino', {
      treinoIndex: index,
      treinoNome: treinos[index].nome
    });
  };

  return (
    <ImageBackground source={require('../../assets/treinos.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Meus Treinos</Text>

        <FlatList
          data={treinos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.treinoItem}>
              <Text 
                style={styles.nomeTreino} 
                onPress={() => navigation.navigate('execucaoTreino', {
                  treinoIndex: index, 
                  treinoNome: item.nome
                })}
              >
                {item.nome}
              </Text>

              <View style={styles.acoes}>
                <TouchableOpacity onPress={() => iniciarTreino(index)}>
                  <Feather name="play-circle" size={22} color="#32CD32" style={styles.icone} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editarTreino(index)}>
                  <Feather name="edit-3" size={22} color="#1E90FF" style={styles.icone} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirTreino(index)}>
                  <Feather name="trash-2" size={22} color="#FF6347" style={styles.icone} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textoBotaoAdicionar}>+ Novo Treino</Text>
        </TouchableOpacity>

        {/* Modal de criação */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>
                {editando !== null ? 'Editar Treino' : 'Novo Treino'}
              </Text>

              <TextInput
                placeholder="Nome do treino"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={novoTreino}
                onChangeText={setNovoTreino}
              />

              <TouchableOpacity style={styles.botaoSalvar} onPress={adicionarTreino}>
                <Text style={styles.textoSalvar}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => {
                  setModalVisible(false);
                  setNovoTreino('');
                  setEditando(null);
                }}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  titulo: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  treinoItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nomeTreino: { color: '#fff', fontSize: 18, fontWeight: '600' },
  acoes: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icone: { marginHorizontal: 6 },
  botaoAdicionar: {
    backgroundColor: 'rgba(50,205,50,0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 40,
  },
  textoBotaoAdicionar: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalConteudo: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: { color: '#000', fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  botaoSalvar: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoSalvar: { color: '#fff', fontWeight: 'bold' },
  botaoCancelar: { alignItems: 'center' },
  textoCancelar: { color: '#777' },
});
