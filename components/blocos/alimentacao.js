import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

export default function AlimentacaoScreen() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [itens, setItens] = useState('');
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarRefeicoes();
  }, []);

  const carregarRefeicoes = async () => {
    const dataHoje = new Date().toDateString();
    const dataSalva = await AsyncStorage.getItem('dataAlimentacao');

    if (dataSalva !== dataHoje) {
      await AsyncStorage.setItem('dataAlimentacao', dataHoje);
      await AsyncStorage.setItem('refeicoes', JSON.stringify([]));
      setRefeicoes([]);
    } else {
      const dados = await AsyncStorage.getItem('refeicoes');
      if (dados) setRefeicoes(JSON.parse(dados));
    }
  };

  const salvarRefeicoes = async (lista) => {
    setRefeicoes(lista);
    await AsyncStorage.setItem('refeicoes', JSON.stringify(lista));
  };

  const adicionarRefeicao = () => {
    if (!nome.trim() || !itens.trim()) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const nova = {
      nome,
      itens,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let listaAtualizada;
    if (editando !== null) {
      listaAtualizada = refeicoes.map((r, i) => (i === editando ? nova : r));
      setEditando(null);
    } else {
      listaAtualizada = [...refeicoes, nova];
    }

    salvarRefeicoes(listaAtualizada);
    setModalVisible(false);
    setNome('');
    setItens('');
  };

  const excluirRefeicao = (index) => {
    Alert.alert('Excluir', 'Deseja remover esta refeição?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        onPress: () => {
          const novaLista = refeicoes.filter((_, i) => i !== index);
          salvarRefeicoes(novaLista);
        },
      },
    ]);
  };

  const editarRefeicao = (index) => {
    const ref = refeicoes[index];
    setNome(ref.nome);
    setItens(ref.itens);
    setEditando(index);
    setModalVisible(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/alimentacao3.jpeg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="coffee" size={28} color="#A8E063" />
          <Text style={styles.titulo}>Alimentação</Text>
        </View>

        <FlatList
          data={refeicoes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.itens}>{item.itens}</Text>
                <Text style={styles.hora}>{item.hora}</Text>
              </View>
              <View style={styles.cardBt}>
                <TouchableOpacity onPress={() => editarRefeicao(index)}>
                  <Feather name="edit-2" size={18} color="#C3FFB0" style={{ marginVertical: 5 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirRefeicao(index)}>
                  <Feather name="trash-2" size={18} color="#FFB6B6" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalVisible(true)}>
          <Feather name="plus-circle" size={22} color="#fff" />
          <Text style={styles.textoBotao}>Registrar refeição</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>
                {editando !== null ? 'Editar Refeição' : 'Nova Refeição'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da refeição (ex: Almoço)"
                placeholderTextColor="#ccc"
                value={nome}
                onChangeText={setNome}
              />
              <TextInput
                style={styles.input}
                placeholder="Alimentos (ex: arroz, frango, salada)"
                placeholderTextColor="#ccc"
                value={itens}
                onChangeText={setItens}
              />
              <TouchableOpacity style={styles.botaoSalvar} onPress={adicionarRefeicao}>
                <Text style={styles.textoSalvar}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
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
      width: '100%',
      height: '100%',
    },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 20, 0, 0.4)',
  },
  container: { 
      flex: 1, 
      paddingHorizontal: 20,
      paddingVertical: 45, 
      justifyContent: 'space-between' 
    },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  titulo: { color: '#E9FFD9', fontSize: 26, fontWeight: 'bold', marginLeft: 10 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBt: {
    justifyContent: 'space-between',
  },
  nome: { color: '#E4FFE4', fontSize: 18, fontWeight: 'bold' },
  itens: { color: '#C6EBC5', fontSize: 14, marginTop: 5 },
  hora: { color: '#A8E063', fontSize: 12, marginTop: 3 },
  botaoAdicionar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(50,205,50,0.8)',
    padding: 15,
    marginBottom: '40',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalConteudo: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: '85%',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: { color: '#006400', fontSize: 20, marginBottom: 15, fontWeight: 'bold' },
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
  textoCancelar: { color: '#555' },
});
