package com.loja.service;

import com.loja.dto.CheckoutRequestDTO;
import com.loja.model.Order;
import com.loja.model.OrderItem;
import com.loja.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CheckoutService {

    private final OrderRepository orderRepository;

    public CheckoutService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Map<String, Object> processOrder(CheckoutRequestDTO request) {
        // 1. Recálculo financeiro seguro no servidor
        BigDecimal subtotal = request.items().stream()
            .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingCost = subtotal.compareTo(new BigDecimal("199.00")) >= 0 
            ? BigDecimal.ZERO 
            : new BigDecimal("14.90");

        BigDecimal discount = "pix".equalsIgnoreCase(request.paymentMethod())
            ? subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        BigDecimal total = subtotal.add(shippingCost).subtract(discount);
        String orderCode = "LUM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 2. Persistência real no Banco de Dados
        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setCustomerName(request.customerName());
        order.setCustomerEmail(request.customerEmail());
        order.setPostalCode(request.postalCode());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus("PENDING");
        order.setTotalAmount(total);

        for (var itemDTO : request.items()) {
            OrderItem item = new OrderItem(
                itemDTO.productId(),
                itemDTO.title(),
                itemDTO.size(),
                itemDTO.quantity(),
                itemDTO.price()
            );
            order.addItem(item);
        }

        orderRepository.save(order); // Salva o pedido e todos os itens de uma vez

        // 3. Monta a resposta para o frontend
        Map<String, Object> response = new HashMap<>();
        response.put("orderCode", orderCode);
        response.put("status", "PENDING_PAYMENT");
        response.put("totalAmount", total);
        response.put("paymentMethod", request.paymentMethod());

        return response;
    }
}