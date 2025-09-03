package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Registration;
import com.university.coursemanagement.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationRepository repo;

    @GetMapping
    public List<Registration> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Registration add(@RequestBody Registration reg) {
        return repo.save(reg);
    }

    @PutMapping("/{id}")
    public Registration update(@PathVariable Long id, @RequestBody Registration reg) {
        Optional<Registration> optional = repo.findById(id);
        if (optional.isPresent()) {
            Registration existing = optional.get();
            existing.setStudent(reg.getStudent());
            existing.setCourse(reg.getCourse());
            existing.setGrade(reg.getGrade());
            return repo.save(existing);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
