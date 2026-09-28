package com.loja.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Senha criptografada com BCrypt

    private String phone;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Já preparamos a relação para os Favoritos futuros!
    // Guarda os IDs dos produtos favoritados pelo cliente
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tb_user_favorites", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "product_id")
    private Set<Long> favoriteProductIds = new HashSet<>();

    public User() {}

    public User(String fullName, String email, String password, String phone) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Set<Long> getFavoriteProductIds() { return favoriteProductIds; }
    public void setFavoriteProductIds(Set<Long> favoriteProductIds) { this.favoriteProductIds = favoriteProductIds; }
}