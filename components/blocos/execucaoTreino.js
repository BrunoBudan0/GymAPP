import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExecucaoTreinoScreen({ route, navigation }) {
  const { treinoIndex, treinoNome } = route.params;
  const [exercicios, setExercicios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [descansoSeries, setDescansoSeries] = useState('');
  const [descansoExercicios, setDescansoExercicios] = useState('');

  useEffect(() => {
    carregarExercicios();
  }, []);

  const carregarExercicios = async () => {
    try {
      const dados = await AsyncStorage.getItem('treinos');
      if (dados) {
        const treinos = JSON.parse(dados);
        if (treinos[treinoIndex] && treinos[treinoIndex].exercicios) {
          setExercicios(treinos[treinoIndex].exercicios);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const salvarExercicios = async (listaExercicios) => {
    try {
      const dados = await AsyncStorage.getItem('treinos');
      if (dados) {
        const treinos = JSON.parse(dados);
        treinos[treinoIndex].exercicios = listaExercicios;
        await AsyncStorage.setItem('treinos', JSON.stringify(treinos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const adicionarExercicio = () => {
    if (!nomeExercicio.trim() || !series || !repeticoes || !descansoSeries || !descansoExercicios) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const exercicio = {
      nome: nomeExercicio,
      series: parseInt(series),
      repeticoes: parseInt(repeticoes),
      descansoSeries: parseInt(descansoSeries),
      descansoExercicios: parseInt(descansoExercicios)
    };


    let listaAtualizada;
    if (editando !== null) {
      listaAtualizada = exercicios.map((ex, i) =>
        i === editando ? exercicio : ex
      );
      setEditando(null);
    } else {
      listaAtualizada = [...exercicios, exercicio];
    }

    setExercicios(listaAtualizada);
    salvarExercicios(listaAtualizada);
    setNomeExercicio('');
    setSeries('');
    setRepeticoes('');
    setDescansoSeries('');
    setDescansoExercicios('');
    setModalVisible(false);
  };

  const excluirExercicio = (index) => {
    Alert.alert('Excluir exercício', 'Deseja realmente excluir este exercício?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        onPress: () => {
          const lista = exercicios.filter((_, i) => i !== index);
          setExercicios(lista);
          salvarExercicios(lista);
        },
        style: 'destructive'
      },
    ]);
  };

  const editarExercicio = (index) => {
    const ex = exercicios[index];
    setNomeExercicio(ex.nome);
    setSeries(ex.series);
    setRepeticoes(ex.repeticoes);
    setDescansoSeries(ex.descansoSeries);
    setDescansoExercicios(ex.descansoExercicios);
    setEditando(index);
    setModalVisible(true);
  };
  
  const iniciarTreino = () => {
  if (exercicios.length === 0) {
    Alert.alert('Aviso', 'Este treino ainda não possui exercícios.');
    return;
  }

  navigation.navigate('iniciarTreino', {
    treinoIndex,
    treinoNome
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{treinoNome}</Text>

      <FlatList
        data={exercicios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.exercicioItem}>
            <View style={styles.exercicioInfo}>
              <Text style={styles.nomeExercicio}>{item.nome}</Text>
              <Text style={styles.detalhes}>
                {item.series}x{item.repeticoes} • Desc. séries: {item.descansoSeries}s • Desc. exercício: {item.descansoExercicios}s
              </Text>
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => editarExercicio(index)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirExercicio(index)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botaoIniciar}
        onPress={iniciarTreino}
      >
        <Text style={styles.textoBotaoAdicionar}>Iniciar Treino</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoBotaoAdicionar}>+ Novo Exercício</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>
                {editando !== null ? 'Editar Exercício' : 'Novo Exercício'}
              </Text>

              <TextInput
                placeholder="Nome do exercício"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={nomeExercicio}
                onChangeText={setNomeExercicio}
              />

              <TextInput
                placeholder="Séries (ex: 3)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={series}
                onChangeText={setSeries}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Repetições (ex: 12)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={repeticoes}
                onChangeText={setRepeticoes}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Descanso entre séries (segundos)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={descansoSeries}
                onChangeText={setDescansoSeries}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Descanso após exercício (segundos)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={descansoExercicios}
                onChangeText={setDescansoExercicios}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.botaoSalvar} onPress={adicionarExercicio}>
                <Text style={styles.textoSalvar}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => {
                  setModalVisible(false);
                  setNomeExercicio('');
                  setSeries('');
                  setRepeticoes('');
                  setDescansoSeries('');
                  setDescansoExercicios('');
                  setEditando(null);
                }}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { color: '#000', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  
  exercicioItem: {
    backgroundColor: '#1C1C1C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exercicioInfo: {
    flex: 1,
  },
  nomeExercicio: { 
    color: '#fff', 
    fontSize: 18,
    marginBottom: 5
  },
  detalhes: { 
    color: '#aaa', 
    fontSize: 14
  },
  acoes: { 
    flexDirection: 'row',
    alignItems: 'center'
  },
  botaoEditar: { color: '#1E90FF', marginRight: 15 },
  botaoExcluir: { color: '#FF6347' },
  
  botaoIniciar:{
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoAdicionar: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoAdicionar: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalConteudo: {
    width: '100%',
    backgroundColor: '#1C1C1C',
    padding: 20,
    borderRadius: 15,
    marginVertical: 50,
  },
  modalTitulo: { color: '#fff', fontSize: 20, marginBottom: 15 },
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