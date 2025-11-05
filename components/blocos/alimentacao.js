import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

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
      listaAtualizada = refeicoes.map((r, i) => i === editando ? nova : r);
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
      { text: 'Excluir', onPress: () => {
        const novaLista = refeicoes.filter((_, i) => i !== index);
        salvarRefeicoes(novaLista);
      }}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="utensils" size={36} color="#32CD32" />
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
            <View>
              <TouchableOpacity onPress={() => editarRefeicao(index)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirRefeicao(index)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoBotao}>+ Registrar refeição</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>{editando !== null ? 'Editar Refeição' : 'Nova Refeição'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da refeição (ex: Almoço)"
              placeholderTextColor="#555"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Alimentos (ex: arroz, frango, salada)"
              placeholderTextColor="#555"
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  titulo: { color: '#000', fontSize: 26, fontWeight: 'bold', marginLeft: 10 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nome: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  itens: { color: '#333', fontSize: 14, marginTop: 5 },
  hora: { color: '#777', fontSize: 12, marginTop: 3 },
  botaoEditar: { color: '#1E90FF', marginTop: 5 },
  botaoExcluir: { color: '#FF6347', marginTop: 5 },
  botaoAdicionar: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalConteudo: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: { color: '#000', fontSize: 20, marginBottom: 15 },
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
