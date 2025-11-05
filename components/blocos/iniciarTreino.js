import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Vibration, ImageBackground } from 'react-native';
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
      <ImageBackground
        source={require('../../assets/pesos.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.containerCentro}>
            <Text style={styles.tituloFim}>Treino Concluído!</Text>
            <Text style={styles.subtituloFim}>Parabéns por completar o treino!</Text>
            <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarTreino}>
              <Text style={styles.textoBotao}>Voltar aos Treinos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  const exercicio = exercicios[exercicioAtual];

  return (
    <ImageBackground
      source={require('../../assets/pesos.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ddd',
    fontSize: 18,
  },
  tituloTreino: {
    color: '#E0E0E0',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressoExercicio: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  exercicioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomeExercicio: {
    color: '#B0FFB0',
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
    color: '#E0E0E0',
    fontSize: 22,
    fontWeight: 'bold',
  },
  repeticoesInfo: {
    color: '#999',
    fontSize: 18,
  },
  infoDescanso: {
    backgroundColor: 'rgba(30,30,30,0.8)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 40,
    width: '90%',
  },
  textoDescanso: {
    color: '#E0E0E0',
    fontSize: 15,
    textAlign: 'center',
  },
  descansoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  descansoTitulo: {
    color: '#B0FFB0',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cronometro: {
    color: '#B0FFB0',
    fontSize: 70,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  proximoTexto: {
    color: '#AAA',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  botaoConcluir: {
    backgroundColor: 'rgba(50,205,50,0.8)',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    width: '85%',
  },
  botaoPular: {
    backgroundColor: 'rgba(70,130,180,0.8)',
    padding: 18,
    borderRadius: 15,
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
    color: '#FF7F7F',
    fontSize: 16,
  },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tituloFim: {
    color: '#B0FFB0',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtituloFim: {
    color: '#CCC',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  botaoFinalizar: {
    backgroundColor: 'rgba(50,205,50,0.8)',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
});
