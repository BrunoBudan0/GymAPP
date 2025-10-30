import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importar suas telas
import LoginScreen from './components/login';
import CadastroScreen from './components/cadastro';
import HomeScreen from './components/home';

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

// Tabs principais do app (quando logado)
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* Adicione outras tabs aqui: Treinos, Hidratação, Alimentação */}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Stack - Login e Cadastro */}
        <Stack.Screen name="Auth" component={AuthStack} />
        
        {/* Main App - Após login */}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}