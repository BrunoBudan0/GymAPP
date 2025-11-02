import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TreinosScreen({ navigation }) {
  const [treinos, setTreinos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTreino, setNovoTreino] = useState('');
  const [editando, setEditando] = useState(null);

  // Carregar treinos salvos
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
    // Essa função só vai funcionar no celular, no ambiente web não
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
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Treinos</Text>

      <FlatList
        data={treinos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.treinoItem}>
            <Text style={styles.nomeTreino} onPress={() => navigation.navigate('execucaoTreino', {treinoIndex: index, treinoNome: item.nome})}>{item.nome}</Text>

            <View style={styles.acoes}>
            <TouchableOpacity onPress={() => iniciarTreino(index)}>
                <Text style={styles.botaoIniciar}>Iniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editarTreino(index)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirTreino(index)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { color: '#000', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  treinoItem: {
    backgroundColor: '#1C1C1C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nomeTreino: { color: '#fff', fontSize: 18 },
  acoes: { flexDirection: 'row' },
  botaoIniciar: {color: '#32CD32', marginRight: 15},
  botaoEditar: { color: '#1E90FF', marginRight: 15 },
  botaoExcluir: { color: '#FF6347' },
  botaoAdicionar: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoAdicionar: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalConteudo: {
    width: '85%',
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: { color: '#fff', fontSize: 20, marginBottom: 10 },
  input: {
    backgroundColor: '#333',
    color: '#fff',
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
  textoCancelar: { color: '#aaa' },
});
