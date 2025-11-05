import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importar suas telas
import LoginScreen from './components/login';
import CadastroScreen from './components/cadastro';
import HomeScreen from './components/home';
import TreinosScreen from './components/blocos/treino';
import ExecucaoTreinoScreen from './components/blocos/execucaoTreino';
import IniciarTreinoScreen from './components/blocos/iniciarTreino';
import HidratacaoScreen from './components/blocos/hidratacao';
import AlimentacaoScreen from './components/blocos/alimentacao';
import PerfilScreen from './components/blocos/perfil';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de Autenticação (Login/Cadastro)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}
// Stack para Treinos (para poder navegar para execução)
function TreinosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaTreinos" component={TreinosScreen} />
      <Stack.Screen name="execucaoTreino" component={ExecucaoTreinoScreen} />
      <Stack.Screen name="iniciarTreino" component={IniciarTreinoScreen} />
    </Stack.Navigator>
  );
}
// Tabs principais do app (quando logado)
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} /*Oculta a parte de cima*/>
      <Tab.Screen name="Treino" component={TreinosStack} />
      <Tab.Screen name="Hidratacao" component={HidratacaoScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Alimentacao" component={AlimentacaoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/*Mudar depois para a auth para cima!!!*/} 
        {/* Main App - Após login */}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Treino" component={MainTabs} />
        <Stack.Screen name="Hidratacao" component={MainTabs} />
        <Stack.Screen name="Alimentacao" component={MainTabs} />
        <Stack.Screen name="Perfil" component={MainTabs} />
        {/* Auth Stack - Login e Cadastro */}
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}