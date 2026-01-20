package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "cost_price", nullable = false)
    private Double costPrice;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock;

    @Column(nullable = false, length = 20)
    private String unit;

    @OneToMany(mappedBy = "ingredient", cascade = {}, orphanRemoval = false)
    @JsonIgnore
    private List<ProductRecipe> productRecipes;
}


