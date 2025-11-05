import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function HidratacaoScreen() {
  const [metaDiaria, setMetaDiaria] = useState(2500);
  const [copoML, setCopoML] = useState(250);
  const [garrafaL, setGarrafaL] = useState(0.5);
  const [consumido, setConsumido] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dataSalva = await AsyncStorage.getItem('dataHidratacao');
      const dataHoje = new Date().toDateString();

      if (dataSalva !== dataHoje) {
        await AsyncStorage.setItem('dataHidratacao', dataHoje);
        await AsyncStorage.setItem('aguaConsumida', '0');
        setConsumido(0);
      } else {
        const valor = await AsyncStorage.getItem('aguaConsumida');
        const meta = await AsyncStorage.getItem('metaDiaria');
        const copo = await AsyncStorage.getItem('copoML');
        const garrafa = await AsyncStorage.getItem('garrafaL');
        if (valor) setConsumido(parseInt(valor));
        if (meta) setMetaDiaria(parseInt(meta));
        if (copo) setCopoML(parseInt(copo));
        if (garrafa) setGarrafaL(parseFloat(garrafa));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const salvarDados = async () => {
    try {
      await AsyncStorage.setItem('metaDiaria', metaDiaria.toString());
      await AsyncStorage.setItem('copoML', copoML.toString());
      await AsyncStorage.setItem('garrafaL', garrafaL.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const salvarConsumo = async (valor) => {
    await AsyncStorage.setItem('aguaConsumida', valor.toString());
  };

  const adicionarAgua = (ml) => {
    const novoTotal = consumido + ml;
    setConsumido(novoTotal);
    salvarConsumo(novoTotal);
  };

  const porcentagem = Math.min((consumido / metaDiaria) * 100, 100);

  return (
    <ImageBackground
      source={require('../../assets/garrafinha.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>Hidratação</Text>

        <AnimatedCircularProgress
          size={200}
          width={14}
          fill={porcentagem}
          tintColor="#1E90FF"
          backgroundColor="rgba(255,255,255,0.3)"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.centroCirculo}>
              <Ionicons name="water-outline" size={60} color="#1E90FF" />
              <Text style={styles.textoLitros}>{(consumido / 1000).toFixed(2)}L</Text>
              <Text style={styles.textoMeta}>Meta: {(metaDiaria / 1000).toFixed(1)}L</Text>
            </View>
          )}
        </AnimatedCircularProgress>

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={styles.botaoAdd} onPress={() => adicionarAgua(copoML)}>
            <Ionicons name="water" size={28} color="#1E90FF" />
            <Text style={styles.textoBotao}>+{copoML}ml</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoAdd} onPress={() => adicionarAgua(garrafaL * 1000)}>
            <Ionicons name="water" size={28} color="#1E90FF" />
            <Text style={styles.textoBotao}>+{garrafaL}L</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoConfig} onPress={() => setModalVisible(true)}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
          <Text style={styles.textoConfig}>Configurar hidratação</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>Hidratação</Text>

              <View style={styles.campo}>
                <Text style={styles.label}>Meta diária</Text>
                <View style={styles.inputArea}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={metaDiaria.toString()}
                    onChangeText={(t) => setMetaDiaria(parseInt(t) || 0)}
                  />
                  <Text style={styles.unidade}>ml</Text>
                </View>
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Copo</Text>
                <View style={styles.inputArea}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={copoML.toString()}
                    onChangeText={(t) => setCopoML(parseInt(t) || 0)}
                  />
                  <Text style={styles.unidade}>ml</Text>
                </View>
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Garrafa</Text>
                <View style={styles.inputArea}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={garrafaL.toString()}
                    onChangeText={(t) => setGarrafaL(parseFloat(t) || 0)}
                  />
                  <Text style={styles.unidade}>L</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={() => {
                  salvarDados();
                  setModalVisible(false);
                }}
              >
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 30, 60, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  centroCirculo: { alignItems: 'center', justifyContent: 'center' },
  textoLitros: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  textoMeta: { fontSize: 14, color: '#DDEEFF' },

  botoesContainer: { flexDirection: 'row', marginTop: 30, gap: 20 },
  botaoAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textoBotao: { color: '#1E90FF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  botaoConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,144,255,0.8)',
    padding: 12,
    borderRadius: 8,
    marginTop: 40,
  },
  textoConfig: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConteudo: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 15,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  campo: { marginBottom: 15 },
  label: { color: '#000', fontSize: 16, marginBottom: 5 },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: { flex: 1, paddingVertical: 8, color: '#000', fontSize: 16 },
  unidade: { color: '#555', fontSize: 16, marginLeft: 5 },
  botaoSalvar: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoSalvar: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoCancelar: { alignItems: 'center', marginTop: 10 },
  textoCancelar: { color: '#888', fontSize: 16 },
});
