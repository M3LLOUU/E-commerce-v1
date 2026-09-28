package com.loja.service;

import com.loja.dto.LoginRequestDTO;
import com.loja.dto.RegisterRequestDTO;
import com.loja.model.User;
import com.loja.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }

        // Criptografa a senha antes de salvar no PostgreSQL
        String encodedPassword = passwordEncoder.encode(request.password());

        User user = new User(
            request.fullName(),
            request.email().toLowerCase().trim(),
            encodedPassword,
            request.phone()
        );

        userRepository.save(user);

        return buildUserResponse(user, "Conta criada com sucesso!");
    }

    public Map<String, Object> login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
            .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas."));

        // Compara o hash seguro da senha digitada com o hash guardado no banco
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas.");
        }

        return buildUserResponse(user, "Login realizado com sucesso!");
    }

    // Gerenciador de Favoritos (preparado para ser chamado pelas rotas)
    public Set<Long> toggleFavorite(Long userId, Long productId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (user.getFavoriteProductIds().contains(productId)) {
            user.getFavoriteProductIds().remove(productId);
        } else {
            user.getFavoriteProductIds().add(productId);
        }

        userRepository.save(user);
        return user.getFavoriteProductIds();
    }

    private Map<String, Object> buildUserResponse(User user, String message) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", message);
        resp.put("userId", user.getId());
        resp.put("fullName", user.getFullName());
        resp.put("email", user.getEmail());
        resp.put("favorites", user.getFavoriteProductIds());
        return resp;
    }
}