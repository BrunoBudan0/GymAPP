import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ImageBackground} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../../config/config';

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUsuario({
        nome: user.displayName || '',
        email: user.email,
      });
    }
  }, []);

  const salvarAlteracoes = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      if (!novoNome.trim() || !novoEmail.trim()) {
        Alert.alert('Preencha todos os campos');
        return;
      }

      await user.updateProfile({ displayName: novoNome });
      if (novoEmail !== user.email) await user.updateEmail(novoEmail);

      Alert.alert('Sucesso', 'Informações atualizadas!');
      setUsuario({ nome: novoNome, email: novoEmail });
      setModalEditar(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível atualizar suas informações.');
    }
  };

  const alterarSenha = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      if (!novaSenha || !confirmarSenha) {
        Alert.alert('Preencha todos os campos');
        return;
      }
      if (novaSenha !== confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }
      if (novaSenha.length < 6) {
        Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
        return;
      }

      await user.updatePassword(novaSenha);
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
      setModalSenha(false);
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Sessão expirada', 'Faça login novamente para alterar a senha.');
        navigation.replace('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível alterar a senha.');
      }
    }
  };

  const logout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar' },
      {
        text: 'Sair',
        onPress: async () => {
          await firebase.auth().signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/background.jpeg')} // mesmo fundo da Home
      style={styles.background}
      blurRadius={1}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="user" size={28} color="#B0EFFF" />
          <Text style={styles.titulo}>Perfil</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valor}>{usuario.nome || '—'}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.valor}>{usuario.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => {
            setNovoNome(usuario.nome);
            setNovoEmail(usuario.email);
            setModalEditar(true);
          }}
        >
          <Feather name="edit-3" size={18} color="#fff" />
          <Text style={styles.textoBotao}>Editar informações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSenha} onPress={() => setModalSenha(true)}>
          <Feather name="lock" size={18} color="#fff" />
          <Text style={styles.textoBotao}>Alterar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
          <Feather name="log-out" size={18} color="#FF9A9A" />
          <Text style={styles.textoLogout}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL EDITAR PERFIL */}
      <Modal visible={modalEditar} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#777"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#777"
              value={novoEmail}
              onChangeText={setNovoEmail}
              keyboardType="email-address"
            />

            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalEditar(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={modalSenha} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Alterar Senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              placeholderTextColor="#777"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#777"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <TouchableOpacity style={styles.botaoSalvar} onPress={alterarSenha}>
              <Text style={styles.textoSalvar}>Salvar nova senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalSenha(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(0, 40, 60, 0.45)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  titulo: {
    color: '#E3F8FF',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  label: { color: '#BFEFFF', fontSize: 14, marginBottom: 5 },
  valor: { color: '#EFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  botaoEditar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,150,255,0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  botaoSenha: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,200,150,0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
  },
  textoLogout: { color: '#FF9A9A', fontWeight: 'bold', fontSize: 16, marginLeft: 6 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConteudo: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: '85%',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: {
    color: '#004C70',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  botaoSalvar: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoSalvar: { color: '#fff', fontWeight: 'bold' },
  botaoCancelar: { alignItems: 'center' },
  textoCancelar: { color: '#555' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#fff', fontSize: 16 },
});
