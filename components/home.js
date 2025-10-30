import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../config/config'; 

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    const auth = getAuth(firebase); 
    
    console.log('🚪 Fazendo logout...');
    
    signOut(auth)
      .then(() => {
        console.log('✅ Logout realizado com sucesso');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      })
      .catch((error) => {
        console.error('❌ Erro ao fazer logout:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App de Treinos!</Text>
      <Text style={styles.subtitle}>Dashboard em construção...</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});