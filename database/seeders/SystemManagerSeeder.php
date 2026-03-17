<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Program;

class SystemManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define Departments and their Programs
        $data = [
            'SENIOR HIGH SCHOOL' => [
                ['name' => 'Science, Technology, Engineering, and Mathematics', 'code' => 'STEM', 'description' => 'Academic Track - STEM'],
                ['name' => 'Accountancy, Business and Management', 'code' => 'ABM', 'description' => 'Academic Track - ABM'],
                ['name' => 'Humanities and Social Sciences', 'code' => 'HUMSS', 'description' => 'Academic Track - HUMSS'],
                ['name' => 'Technical-Vocational-Livelihood', 'code' => 'TVL', 'description' => 'TVL Track'],
            ],
            'COLLEGE OF COMPUTER STUDIES' => [
                ['name' => 'Bachelor of Science in Information Systems', 'code' => 'BSIS', 'description' => 'Focuses on the design and implementation of information systems.'],
                ['name' => 'Bachelor of Science in Information Technology', 'code' => 'BSIT', 'description' => 'Focuses on the utilization of computers and computer software to plan, install, customize, operate, manage, administer and maintain information technology infrastructure.'],
                ['name' => 'Bachelor of Science in Computer Science', 'code' => 'BSCS', 'description' => 'Focuses on the study of concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.'],
            ],
            'COLLEGE OF BUSINESS AND ACCOUNTANCY' => [
                ['name' => 'Bachelor of Science in Accountancy', 'code' => 'BSA', 'description' => 'A program that provides general accounting education.'],
                ['name' => 'Bachelor of Science in Business Administration', 'code' => 'BSBA', 'description' => 'A program that provides fundamental business concepts.'],
            ],
            'COLLEGE OF EDUCATION' => [
                ['name' => 'Bachelor of Secondary Education', 'code' => 'BSED', 'description' => 'Prepares students for teaching in high school.'],
                ['name' => 'Bachelor of Elementary Education', 'code' => 'BEED', 'description' => 'Prepares students for teaching in elementary school.'],
            ],
            'COLLEGE OF ENGINEERING' => [
                ['name' => 'Bachelor of Science in Civil Engineering', 'code' => 'BSCE', 'description' => 'Focuses on the design, construction, and maintenance of the physical and naturally built environment.'],
                ['name' => 'Bachelor of Science in Computer Engineering', 'code' => 'BSCPE', 'description' => 'Integrates several fields of computer science and electronic engineering required to develop computer hardware and software.'],
            ],
        ];

        foreach ($data as $deptName => $programs) {
            $department = Department::firstOrCreate(['name' => $deptName]);

            foreach ($programs as $prog) {
                Program::firstOrCreate(
                    [
                        'department_id' => $department->id,
                        'code' => $prog['code'],
                    ],
                    [
                        'name' => $prog['name'],
                        'description' => $prog['description'],
                    ]
                );
            }
        }
    }
}
