package com.inventory.service;

import com.inventory.entity.Ingredient;
import com.inventory.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    @Transactional(readOnly = true)
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    public Ingredient saveIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<Ingredient> getIngredientById(Long id) {
        return ingredientRepository.findById(id);
    }

    public void deleteIngredient(Long id) {
        ingredientRepository.deleteById(id);
    }
}


