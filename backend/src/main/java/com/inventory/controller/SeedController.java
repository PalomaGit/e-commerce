package com.inventory.controller;

import com.inventory.entity.Ingredient;
import com.inventory.entity.Product;
import com.inventory.entity.ProductRecipe;
import com.inventory.repository.IngredientRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.ProductRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "https://inventory-app-swart-nine.vercel.app"})
public class SeedController {

    private final IngredientRepository ingredientRepository;
    private final ProductRepository productRepository;
    private final ProductRecipeRepository productRecipeRepository;

    @PostMapping("/seed")
    @Transactional
    public ResponseEntity<String> seedData() {
        try {
            if (ingredientRepository.count() == 0) {
                seedIngredients();
            }
            if (productRepository.count() == 0) {
                seedProducts();
            }
            return ResponseEntity.ok("Datos inicializados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private void seedIngredients() {
        List<Ingredient> ingredients = new ArrayList<>();
        ingredients.add(createIngredient("Huevos", 0.33, 12, "unidad"));
        ingredients.add(createIngredient("Patatas", 1.20, 10, "kg"));
        ingredients.add(createIngredient("Cebolla", 1.50, 5, "kg"));
        ingredients.add(createIngredient("Aceite de Oliva", 8.50, 2, "L"));
        ingredients.add(createIngredient("Sal", 0.80, 20, "kg"));
        ingredients.add(createIngredient("Pimienta", 3.50, 1, "kg"));
        ingredients.add(createIngredient("Harina", 0.95, 10, "kg"));
        ingredients.add(createIngredient("Azúcar", 1.10, 10, "kg"));
        ingredients.add(createIngredient("Mantequilla", 4.20, 5, "kg"));
        ingredients.add(createIngredient("Leche", 0.85, 10, "L"));
        ingredients.add(createIngredient("Tomate", 2.20, 8, "kg"));
        ingredients.add(createIngredient("Ajo", 6.00, 2, "kg"));
        ingredients.add(createIngredient("Pimiento Rojo", 3.50, 5, "kg"));
        ingredients.add(createIngredient("Pimiento Verde", 2.80, 5, "kg"));
        ingredients.add(createIngredient("Carne Picada", 8.50, 5, "kg"));
        ingredients.add(createIngredient("Pollo", 6.50, 5, "kg"));
        ingredients.add(createIngredient("Queso", 12.00, 3, "kg"));
        ingredients.add(createIngredient("Jamón Serrano", 28.00, 2, "kg"));
        ingredients.add(createIngredient("Pan", 1.20, 20, "unidad"));
        ingredients.add(createIngredient("Levadura", 1.50, 1, "kg"));
        ingredients.add(createIngredient("Aceitunas", 4.50, 3, "kg"));
        ingredients.add(createIngredient("Atún en Lata", 3.20, 20, "unidad"));
        ingredients.add(createIngredient("Anchoas", 12.00, 5, "kg"));
        ingredients.add(createIngredient("Limón", 2.50, 10, "kg"));
        ingredients.add(createIngredient("Perejil", 3.00, 1, "kg"));
        ingredients.add(createIngredient("Orégano", 8.00, 1, "kg"));
        ingredients.add(createIngredient("Albahaca", 4.50, 1, "kg"));
        ingredients.add(createIngredient("Aceite de Girasol", 2.80, 5, "L"));
        ingredients.add(createIngredient("Vinagre", 1.50, 5, "L"));
        ingredients.add(createIngredient("Mayonesa", 2.20, 10, "unidad"));
        ingredients.add(createIngredient("Azafrán", 45.00, 1, "kg"));
        ingredients.add(createIngredient("Pepino", 2.00, 8, "kg"));
        ingredients.add(createIngredient("Judías Verdes", 3.50, 5, "kg"));
        ingredients.add(createIngredient("Arroz", 1.80, 15, "kg"));
        ingredientRepository.saveAll(ingredients);
    }

    private Ingredient createIngredient(String name, double costPrice, int stock, String unit) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);
        ingredient.setCostPrice(costPrice);
        ingredient.setCurrentStock(stock);
        ingredient.setUnit(unit);
        return ingredient;
    }

    private void seedProducts() {
        List<Ingredient> ingredients = ingredientRepository.findAll();
        Ingredient huevos = findIngredient(ingredients, "Huevos");
        Ingredient patatas = findIngredient(ingredients, "Patatas");
        Ingredient cebolla = findIngredient(ingredients, "Cebolla");
        Ingredient aceiteOliva = findIngredient(ingredients, "Aceite de Oliva");
        Ingredient sal = findIngredient(ingredients, "Sal");
        Ingredient pimienta = findIngredient(ingredients, "Pimienta");
        Ingredient harina = findIngredient(ingredients, "Harina");
        Ingredient mantequilla = findIngredient(ingredients, "Mantequilla");
        Ingredient leche = findIngredient(ingredients, "Leche");
        Ingredient tomate = findIngredient(ingredients, "Tomate");
        Ingredient ajo = findIngredient(ingredients, "Ajo");
        Ingredient pimientoRojo = findIngredient(ingredients, "Pimiento Rojo");
        Ingredient pimientoVerde = findIngredient(ingredients, "Pimiento Verde");
        Ingredient pollo = findIngredient(ingredients, "Pollo");
        Ingredient jamon = findIngredient(ingredients, "Jamón Serrano");
        Ingredient pan = findIngredient(ingredients, "Pan");
        Ingredient aceitunas = findIngredient(ingredients, "Aceitunas");
        Ingredient aceiteGirasol = findIngredient(ingredients, "Aceite de Girasol");
        Ingredient vinagre = findIngredient(ingredients, "Vinagre");
        Ingredient mayonesa = findIngredient(ingredients, "Mayonesa");
        Ingredient azafran = findIngredient(ingredients, "Azafrán");
        Ingredient pepino = findIngredient(ingredients, "Pepino");
        Ingredient judiasVerdes = findIngredient(ingredients, "Judías Verdes");
        Ingredient arroz = findIngredient(ingredients, "Arroz");

        if (huevos != null && patatas != null) {
            Product tortillaPatatas = createProduct("Tortilla de Patatas", 
                "Tortilla española tradicional con patatas y cebolla", 8.50, 10);
            Product saved = productRepository.save(tortillaPatatas);
            addRecipe(saved, huevos, 4.0);
            addRecipe(saved, patatas, 0.5);
            addRecipe(saved, cebolla, 0.2);
            addRecipe(saved, aceiteOliva, 0.05);
            addRecipe(saved, sal, 0.01);
        }

        if (pollo != null && arroz != null) {
            Product paella = createProduct("Paella Valenciana",
                "Paella tradicional con pollo, judías verdes y arroz", 12.00, 8);
            Product saved = productRepository.save(paella);
            addRecipe(saved, pollo, 0.3);
            addRecipe(saved, tomate, 0.2);
            addRecipe(saved, pimientoRojo, 0.1);
            addRecipe(saved, ajo, 0.02);
            addRecipe(saved, aceiteOliva, 0.03);
            addRecipe(saved, sal, 0.01);
            if (azafran != null) addRecipe(saved, azafran, 0.001);
            if (judiasVerdes != null) addRecipe(saved, judiasVerdes, 0.2);
            addRecipe(saved, arroz, 0.3);
        }

        if (tomate != null) {
            Product gazpacho = createProduct("Gazpacho Andaluz",
                "Sopa fría tradicional andaluza con tomate, pepino y pimiento", 6.50, 15);
            Product saved = productRepository.save(gazpacho);
            addRecipe(saved, tomate, 0.5);
            addRecipe(saved, pimientoRojo, 0.2);
            addRecipe(saved, pimientoVerde, 0.1);
            if (pepino != null) addRecipe(saved, pepino, 0.2);
            addRecipe(saved, ajo, 0.01);
            addRecipe(saved, aceiteOliva, 0.05);
            addRecipe(saved, vinagre, 0.02);
            addRecipe(saved, sal, 0.01);
        }

        if (jamon != null && harina != null) {
            Product croquetas = createProduct("Croquetas de Jamón",
                "Croquetas caseras de jamón serrano", 9.50, 12);
            Product saved = productRepository.save(croquetas);
            addRecipe(saved, jamon, 0.2);
            addRecipe(saved, harina, 0.1);
            addRecipe(saved, leche, 0.25);
            addRecipe(saved, mantequilla, 0.05);
            addRecipe(saved, aceiteGirasol, 0.1);
            addRecipe(saved, sal, 0.01);
            addRecipe(saved, pimienta, 0.001);
        }

        if (patatas != null && huevos != null) {
            Product ensaladilla = createProduct("Ensaladilla Rusa",
                "Ensaladilla rusa tradicional con patatas, huevo y mayonesa", 7.00, 10);
            Product saved = productRepository.save(ensaladilla);
            addRecipe(saved, patatas, 0.3);
            addRecipe(saved, huevos, 2.0);
            addRecipe(saved, mayonesa, 0.1);
            addRecipe(saved, aceitunas, 0.05);
            addRecipe(saved, sal, 0.01);
        }

        if (tomate != null && pan != null) {
            Product salmorejo = createProduct("Salmorejo Cordobés",
                "Salmorejo tradicional cordobés con tomate y pan", 6.00, 12);
            Product saved = productRepository.save(salmorejo);
            addRecipe(saved, tomate, 0.6);
            addRecipe(saved, pan, 0.15);
            addRecipe(saved, aceiteOliva, 0.08);
            addRecipe(saved, ajo, 0.01);
            addRecipe(saved, sal, 0.01);
            addRecipe(saved, huevos, 1.0);
            addRecipe(saved, jamon, 0.05);
        }

        if (huevos != null) {
            Product tortillaFrancesa = createProduct("Tortilla Francesa",
                "Tortilla simple de huevos", 4.50, 20);
            Product saved = productRepository.save(tortillaFrancesa);
            addRecipe(saved, huevos, 2.0);
            addRecipe(saved, aceiteGirasol, 0.01);
            addRecipe(saved, sal, 0.005);
        }

        if (pan != null && tomate != null) {
            Product panConTomate = createProduct("Pan con Tomate",
                "Pan tostado con tomate y aceite de oliva", 3.50, 25);
            Product saved = productRepository.save(panConTomate);
            addRecipe(saved, pan, 1.0);
            addRecipe(saved, tomate, 0.1);
            addRecipe(saved, aceiteOliva, 0.01);
            addRecipe(saved, ajo, 0.005);
            addRecipe(saved, sal, 0.002);
        }
    }

    private Product createProduct(String name, String description, double price, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        return product;
    }

    private void addRecipe(Product product, Ingredient ingredient, double quantity) {
        if (ingredient != null && product != null && product.getId() != null) {
            ProductRecipe recipe = new ProductRecipe();
            recipe.setProduct(product);
            recipe.setIngredient(ingredient);
            recipe.setQuantity(quantity);
            productRecipeRepository.save(recipe);
        }
    }

    private Ingredient findIngredient(List<Ingredient> ingredients, String name) {
        return ingredients.stream()
                .filter(i -> i.getName().equals(name))
                .findFirst()
                .orElse(null);
    }
}
