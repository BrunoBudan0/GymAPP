import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IniciarTreinoScreen({ route, navigation }) {
  const { treinoIndex, treinoNome } = route.params;
  const [exercicios, setExercicios] = useState([]);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [serieAtual, setSerieAtual] = useState(1);
  const [emDescanso, setEmDescanso] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [treinoFinalizado, setTreinoFinalizado] = useState(false);

  useEffect(() => {
    carregarExercicios();
  }, []);

  useEffect(() => {
    let intervalo;
    if (emDescanso && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            Vibration.vibrate(800);
            setEmDescanso(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [emDescanso, tempoRestante]);

  const carregarExercicios = async () => {
    try {
      const dados = await AsyncStorage.getItem('treinos');
      if (dados) {
        const treinos = JSON.parse(dados);
        const treino = treinos[treinoIndex];
        if (treino?.exercicios?.length) {
          setExercicios(treino.exercicios);
        } else {
          Alert.alert('Aviso', 'Este treino não tem exercícios cadastrados.');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const concluirSerie = () => {
    const exercicio = exercicios[exercicioAtual];
    if (serieAtual < parseInt(exercicio.series)) {
      setEmDescanso(true);
      setTempoRestante(parseInt(exercicio.descansoSeries));
      setSerieAtual(serieAtual + 1);
    } else if (exercicioAtual < exercicios.length - 1) {
      setEmDescanso(true);
      setTempoRestante(parseInt(exercicio.descansoExercicios));
      setExercicioAtual(exercicioAtual + 1);
      setSerieAtual(1);
    } else {
      setTreinoFinalizado(true);
    }
  };

  const pularDescanso = () => {
    setEmDescanso(false);
    setTempoRestante(0);
  };

  const finalizarTreino = () => {
    Alert.alert('Parabéns!', 'Treino finalizado com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('ListaTreinos') }
    ]);
  };

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs.toString().padStart(2, '0')}`;
  };

  if (exercicios.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando treino...</Text>
      </View>
    );
  }

  if (treinoFinalizado) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.tituloFim}>Treino Concluído!</Text>
        <Text style={styles.subtituloFim}>Parabéns por completar o treino!</Text>
        <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarTreino}>
          <Text style={styles.textoBotao}>Voltar aos Treinos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const exercicio = exercicios[exercicioAtual];

  return (
    <View style={styles.container}>
      <Text style={styles.tituloTreino}>{treinoNome}</Text>
      <Text style={styles.progressoExercicio}>
        Exercício {exercicioAtual + 1} de {exercicios.length}
      </Text>

      {emDescanso ? (
        <View style={styles.descansoContainer}>
          <Text style={styles.descansoTitulo}>Descanso</Text>
          <Text style={styles.cronometro}>{formatarTempo(tempoRestante)}</Text>
          <Text style={styles.proximoTexto}>
            Próximo:{' '}
            {exercicioAtual < exercicios.length - 1
              ? exercicios[exercicioAtual + 1].nome
              : 'Fim do treino'}
          </Text>
          <TouchableOpacity style={styles.botaoPular} onPress={pularDescanso}>
            <Text style={styles.textoBotao}>Pular Descanso</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.exercicioContainer}>
          <Text style={styles.nomeExercicio}>{exercicio.nome}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.serieInfo}>
              Série {serieAtual} de {exercicio.series}
            </Text>
            <Text style={styles.repeticoesInfo}>
              {exercicio.repeticoes} repetições
            </Text>
          </View>

          <View style={styles.infoDescanso}>
            <Text style={styles.textoDescanso}>
              Descanso por série: {exercicio.descansoSeries}s
            </Text>
            {exercicioAtual < exercicios.length - 1 && (
              <Text style={styles.textoDescanso}>
                Descanso entre exercícios: {exercicio.descansoExercicios}s
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.botaoConcluir} onPress={concluirSerie}>
            <Text style={styles.textoBotao}>✓ Concluir Série</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoCancelar}
            onPress={() =>
              Alert.alert('Cancelar Treino', 'Deseja realmente sair do treino?', [
                { text: 'Não' },
                { text: 'Sim', onPress: () => navigation.goBack() },
              ])
            }
          >
            <Text style={styles.textoCancelar}>Cancelar Treino</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#000',
    fontSize: 18,
  },
  tituloTreino: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressoExercicio: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  exercicioContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nomeExercicio: {
    color: '#32CD32',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  serieInfo: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  repeticoesInfo: {
    color: '#777',
    fontSize: 18,
  },
  infoDescanso: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 40,
  },
  textoDescanso: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  descansoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descansoTitulo: {
    color: '#32CD32',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cronometro: {
    color: '#32CD32',
    fontSize: 70,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  proximoTexto: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  botaoConcluir: {
    backgroundColor: '#32CD32',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  botaoPular: {
    backgroundColor: '#1E90FF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  botaoCancelar: {
    padding: 15,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoCancelar: {
    color: '#FF6347',
    fontSize: 16,
  },
  containerCentro: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tituloFim: {
    color: '#32CD32',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtituloFim: {
    color: '#777',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  botaoFinalizar: {
    backgroundColor: '#32CD32',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
});
