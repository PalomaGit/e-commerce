package com.inventory.controller;

import com.inventory.entity.Ingredient;
import com.inventory.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class IngredientController {

    private final IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable Long id) {
        Optional<Ingredient> ingredient = ingredientService.getIngredientById(id);
        return ingredient.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ingredient> saveIngredient(@RequestBody Ingredient ingredient) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredientService.saveIngredient(ingredient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, @RequestBody Ingredient ingredient) {
        Optional<Ingredient> existing = ingredientService.getIngredientById(id);
        if (existing.isPresent()) {
            Ingredient existingIngredient = existing.get();
            existingIngredient.setName(ingredient.getName());
            existingIngredient.setCostPrice(ingredient.getCostPrice());
            existingIngredient.setCurrentStock(ingredient.getCurrentStock());
            existingIngredient.setUnit(ingredient.getUnit());
            return ResponseEntity.ok(ingredientService.saveIngredient(existingIngredient));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.noContent().build();
    }
}
