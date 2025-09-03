package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository repo;

    @GetMapping
    public List<Student> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return repo.save(student);
    }

    // Update student
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
        Optional<Student> optional = repo.findById(id);
        if (optional.isPresent()) {
            Student existing = optional.get();
            existing.setName(student.getName());
            existing.setEmail(student.getEmail());
            return repo.save(existing);
        } else {
            return null; // or throw exception
        }
    }

    // Delete student
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
