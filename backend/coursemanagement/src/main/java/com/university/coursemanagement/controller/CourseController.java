package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Course;
import com.university.coursemanagement.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository repo;

    @GetMapping
    public List<Course> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        return repo.save(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Optional<Course> optional = repo.findById(id);
        if (optional.isPresent()) {
            Course existing = optional.get();
            existing.setTitle(course.getTitle());
            existing.setCode(course.getCode());
            return repo.save(existing);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
