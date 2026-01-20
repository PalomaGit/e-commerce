package com.inventory.service;

import com.inventory.entity.Product;
import com.inventory.entity.ProductRecipe;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.ProductRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductRecipeRepository productRecipeRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            if (product.getId() != null) {
                product.setRecipes(productRecipeRepository.findByProductId(product.getId()));
            }
            calculateCosts(product);
        }
        return products;
    }

    public Product saveProduct(Product product) {
        Product saved = productRepository.save(product);
        
        if (product.getId() != null) {
            productRecipeRepository.findByProductId(product.getId()).forEach(productRecipeRepository::delete);
        }
        
        if (product.getRecipes() != null && !product.getRecipes().isEmpty()) {
            product.getRecipes().forEach(recipe -> {
                recipe.setProduct(saved);
                recipe.setId(null);
            });
            productRecipeRepository.saveAll(product.getRecipes());
            saved.setRecipes(product.getRecipes());
        }
        
        calculateCosts(saved);
        return saved;
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductById(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        productOpt.ifPresent(product -> {
            product.setRecipes(productRecipeRepository.findByProductId(id));
            calculateCosts(product);
        });
        return productOpt;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private void calculateCosts(Product product) {
        double totalCost = 0.0;
        if (product.getRecipes() != null && !product.getRecipes().isEmpty()) {
            for (ProductRecipe recipe : product.getRecipes()) {
                if (recipe.getIngredient() != null) {
                    totalCost += recipe.getIngredient().getCostPrice() * recipe.getQuantity();
                }
            }
        }
        product.setCalculatedCost(totalCost);
        product.setProfitMargin(product.getPrice() - totalCost);
    }
}
