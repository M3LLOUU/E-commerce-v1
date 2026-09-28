package com.loja.controller;

import com.loja.dto.CheckoutRequestDTO;
import com.loja.service.CheckoutService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    // Injeção de dependência pelo construtor (boa prática Spring)
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processCheckout(@Valid @RequestBody CheckoutRequestDTO request) {
        Map<String, Object> orderResult = checkoutService.processOrder(request);
        return ResponseEntity.ok(orderResult);
    }
}