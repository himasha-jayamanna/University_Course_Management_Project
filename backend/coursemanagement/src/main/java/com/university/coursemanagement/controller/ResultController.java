package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Result;
import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.entity.Course;
import com.university.coursemanagement.repository.ResultRepository;
import com.university.coursemanagement.repository.StudentRepository;
import com.university.coursemanagement.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultRepository resultRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private CourseRepository courseRepo;

    @GetMapping
    public List<Result> getAll() {
        return resultRepo.findAll();
    }

    @PostMapping
    public Result addResult(@RequestBody ResultRequest req) {
        Optional<Student> studentOpt = studentRepo.findById(req.getStudentId());
        Optional<Course> courseOpt = courseRepo.findById(req.getCourseId());
        if (studentOpt.isPresent() && courseOpt.isPresent()) {
            Result result = new Result();
            result.setStudent(studentOpt.get());
            result.setCourse(courseOpt.get());
            result.setGrade(convertScoreToGrade(req.getScore()));
            result.setRemarks(""); // optional
            return resultRepo.save(result);
        }
        return null;
    }

    @PutMapping("/{id}")
    public Result updateResult(@PathVariable Long id, @RequestBody ResultRequest req) {
        Optional<Result> optional = resultRepo.findById(id);
        if (optional.isPresent()) {
            Result result = optional.get();
            studentRepo.findById(req.getStudentId()).ifPresent(result::setStudent);
            courseRepo.findById(req.getCourseId()).ifPresent(result::setCourse);
            result.setGrade(convertScoreToGrade(req.getScore()));
            return resultRepo.save(result);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteResult(@PathVariable Long id) {
        resultRepo.deleteById(id);
    }

    // Helper method for grading
    private String convertScoreToGrade(int score) {
        if (score >= 85) return "A+";
        else if (score >= 75) return "A";
        else if (score >= 70) return "A-";
        else if (score >= 65) return "B+";
        else if (score >= 60) return "B";
        else if (score >= 55) return "B-";
        else if (score >= 45) return "C+";
        else if (score >= 40) return "C";
        else if (score >= 35) return "C-";
        else return "D";
    }

    // Request DTO
    public static class ResultRequest {
        private Long studentId;
        private Long courseId;
        private int score;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
    }
}
