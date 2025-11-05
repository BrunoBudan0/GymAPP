import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
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
      Alert.alert('Erro', 'Não foi possível atualizar suas informações. Tente novamente.');
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
        Alert.alert(
          'Sessão expirada',
          'Por segurança, faça login novamente para alterar sua senha.'
        );
        navigation.replace('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível alterar a senha.');
      }
    }
  };

  const logout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="user-circle" size={36} color="#007AFF" />
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
        <Text style={styles.textoBotao}>Editar informações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSenha} onPress={() => setModalSenha(true)}>
        <Text style={styles.textoBotao}>Alterar senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
        <Text style={styles.textoLogout}>Sair da conta</Text>
      </TouchableOpacity>

      {/* MODAL EDITAR PERFIL */}
      <Modal visible={modalEditar} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>

            <Text style={styles.campoLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Seu nome"
              placeholderTextColor="#777"
            />

            <Text style={styles.campoLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={novoEmail}
              onChangeText={setNovoEmail}
              placeholder="Seu email"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalEditar(false)} style={styles.botaoCancelar}>
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

            <Text style={styles.campoLabel}>Nova senha</Text>
            <TextInput
              style={styles.input}
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Nova senha"
              placeholderTextColor="#777"
              secureTextEntry
            />

            <Text style={styles.campoLabel}>Confirmar nova senha</Text>
            <TextInput
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirmar senha"
              placeholderTextColor="#777"
              secureTextEntry
            />

            <TouchableOpacity style={styles.botaoSalvar} onPress={alterarSenha}>
              <Text style={styles.textoSalvar}>Salvar nova senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalSenha(false)} style={styles.botaoCancelar}>
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
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  label: { color: '#888', fontSize: 14, marginBottom: 5 },
  valor: { color: '#000', fontSize: 18, fontWeight: '600', marginBottom: 15 },
  botaoEditar: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoSenha: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  botaoLogout: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoLogout: { color: '#FF6347', fontWeight: 'bold', fontSize: 16 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConteudo: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  campoLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
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
  textoCancelar: { color: '#777' },
  loadingText: { color: '#666', fontSize: 16, textAlign: 'center', marginTop: 40 },
});
