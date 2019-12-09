package sbcrud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import sbcrud.model.Role;
import sbcrud.model.User;
import sbcrud.service.RoleService;
import sbcrud.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/admin/")
public class AdminController {

    private UserService userService;
    private RoleService roleService;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public void setUserService(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping(value = "/list")
    public String allUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "list-page";
    }

    @GetMapping(value = "/edit/{id}")
    public String getEditPage(@PathVariable("id") Long id, Model model) {
        User user = userService.getUserById(id);
        model.addAttribute("user", user);
        return "edit-user-form";
    }

    @PostMapping(value = "/edit")
    public String editUser(@ModelAttribute("user") User user,
                           @RequestParam("role") String role) {
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(role));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(roles);
        userService.updateUser(user);
        return "redirect:/admin/list";
    }

    @GetMapping(value = "/add")
    public String getAddPage() {
        return "add-user-form";
    }

    @PostMapping(value = "/add")
    public String addUser(@ModelAttribute("user") User user,
                          @RequestParam("role") String role) {
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.getRoleByName(role));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(roles);
        userService.addUser(user);
        return "redirect:/admin/list";
    }

    @GetMapping(value = "/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        User userToDelete = userService.getUserById(id);
        userService.deleteUser(userToDelete);
        return "redirect:/admin/list";
    }
}
