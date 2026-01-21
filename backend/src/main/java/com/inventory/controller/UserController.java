package com.inventory.controller;

import com.inventory.dto.ChangePasswordRequest;
import com.inventory.dto.UpdateProfileRequest;
import com.inventory.dto.UserProfileResponse;
import com.inventory.entity.User;
import com.inventory.security.JwtTokenProvider;
import com.inventory.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "https://inventory-app-swart-nine.vercel.app", "https://inventory-fh6t48v7j-palomagits-projects.vercel.app", "https://inventory-72duhbquw-palomagits-projects.vercel.app"})
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
        String username = getCurrentUsername(request);
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserProfileResponse response = mapToProfileResponse(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest updateRequest,
            HttpServletRequest request) {
        String username = getCurrentUsername(request);
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        User updated = userService.updateProfile(
                user.getId(),
                updateRequest.getFirstName(),
                updateRequest.getLastName(),
                updateRequest.getEmail(),
                updateRequest.getPhone(),
                updateRequest.getBio(),
                updateRequest.getProfilePicture()
        );

        return ResponseEntity.ok(mapToProfileResponse(updated));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {
        String username = getCurrentUsername(httpRequest);
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        userService.changePassword(
                user.getId(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

    private String getCurrentUsername(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token != null && tokenProvider.validateToken(token)) {
            return tokenProvider.getUsernameFromToken(token);
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhone(user.getPhone());
        response.setProfilePicture(user.getProfilePicture());
        response.setBio(user.getBio());
        
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        response.setRoles(roleNames);
        
        return response;
    }
}

