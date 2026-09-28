E-Commerce

Aplicação full stack de e-commerce, desenvolvida com arquitetura moderna, autenticação segura com encriptação, catálogo interativo de produtos, gestão de sacola em tempo real e infraestrutura de base de dados conteinerizada.

---

## 📌 Funcionalidades

- **Catálogo & Vitrine Interativa:** Listagem dinâmica de produtos com suporte a seleção de tamanhos e filtro por categorias (Conjuntos, Sutiãs, Noite, etc.).
- **Sacola de Compras (Cart Drawer):** Gestão de estado no cliente (adição, remoção, alteração de quantidades e cálculo de subtotal) persistida em `localStorage`.
- **Autenticação Segura:**
  - Registo e início de sessão de utilizadores com validação estrita de formato de e-mail.
  - Medidor de força de senha no frontend com critérios visuais em tempo real (mínimo de 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais).
  - Encriptação de palavras-passe com **BCrypt** no backend.
- **Guia de Medidas:** Modal informativo integrado para auxílio à compra.
- **Persistência de Dados:** Base de dados relacional PostgreSQL gerida via Spring Data JPA.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5 & CSS3:** Design responsivo, estilização personalizada sem dependência de frameworks externos.
- **JavaScript** integração assíncrona com `Fetch API` e manipulação reativa do DOM.

### Backend
- **Java 17/ Spring Boot 3:** API RESTful robusta.
- **Spring Security & BCrypt:** Proteção de endpoints e hashing seguro de credenciais.
- **Spring Data JPA & Hibernate:** Mapeamento objeto-relacional (ORM).
- **Bean Validation:** Validação declarativa de DTOs no servidor (`@Valid`, `@NotBlank`, `@Email`, etc.).

### Infraestrutura & Ferramentas
- **PostgreSQL:** Base de dados relacional.
- **Docker & Docker Compose:** Conteinerização da base de dados local.
- **Maven:** Gestor de dependências e automação de build.
- **Git & GitHub:** Controlo de versões seguindo boas práticas de `.gitignore`.
