package com.loja.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String title;
    private String size;
    private int quantity;
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    public OrderItem() {}

    public OrderItem(Long productId, String title, String size, int quantity, BigDecimal price) {
        this.productId = productId;
        this.title = title;
        this.size = size;
        this.quantity = quantity;
        this.price = price;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getTitle() { return title; }
    public String getSize() { return size; }
    public int getQuantity() { return quantity; }
    public BigDecimal getPrice() { return price; }
    public void setOrder(Order order) { this.order = order; }
}