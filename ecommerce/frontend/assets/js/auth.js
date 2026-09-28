// frontend/assets/js/auth.js
import { CONFIG } from './config.js';

// Expressão regular rigorosa para e-mail
export function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

// Validador de requisitos de senha forte
export function checkPasswordStrength(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const passedCount = Object.values(requirements).filter(Boolean).length;
  
  return {
    requirements,
    isStrong: passedCount === 5,
    score: passedCount // de 0 a 5
  };
}

// Funções de comunicação com o Backend Spring Boot
export async function registerUser({ fullName, email, password, phone }) {
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, phone })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Falha ao registar a conta.');
  }
  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Credenciais inválidas.');
  }
  return data;
}

// Gestão de sessão no navegador
export function setAuthSession(user) {
  localStorage.setItem('lumina_user', JSON.stringify(user));
  document.dispatchEvent(new CustomEvent('auth:change', { detail: user }));
}

export function getAuthUser() {
  const user = localStorage.getItem('lumina_user');
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem('lumina_user');
  document.dispatchEvent(new CustomEvent('auth:change', { detail: null }));
}