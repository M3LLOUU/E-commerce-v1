package com.loja.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record CheckoutRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String customerName,

    @Email(message = "E-mail inválido")
    @NotBlank(message = "O e-mail é obrigatório")
    String customerEmail,

    @NotBlank(message = "O CEP é obrigatório")
    String postalCode,

    @NotBlank(message = "O método de pagamento é obrigatório")
    String paymentMethod,

    @NotNull(message = "A lista de itens não pode estar vazia")
    List<ItemDTO> items
) {
    public record ItemDTO(
        Long productId,
        String title,
        String size,
        int quantity,
        BigDecimal price
    ) {}
}