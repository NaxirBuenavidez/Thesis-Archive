<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            'SENIOR HIGH SCHOOL' => [
                ['name' => 'STEM (Science, Technology, Engineering, Mathematics)', 'code' => 'STEM'],
                ['name' => 'ABM (Accountancy, Business, and Management)', 'code' => 'ABM'],
                ['name' => 'HUMSS (Humanities and Social Sciences)', 'code' => 'HUMSS'],
                ['name' => 'GAS (General Academic Strand)', 'code' => 'GAS'],
            ],
            'COMPUTER STUDIES' => [
                ['name' => 'Bachelor of Science in Information Systems', 'code' => 'BSIS'],
            ],
            'TEACHERS EDUCATION' => [
                ['name' => 'Bachelor of Elementary Education', 'code' => 'BEEd'],
            ],
            'BUSINESS ADMINISTRATION' => [
                ['name' => 'Bachelor of Science in Business Administration', 'code' => 'BSBA', 'description' => 'Marketing Management, Operational Management'],
            ],
            'HOSPITALITY EDUCATION' => [
                ['name' => 'Bachelor of Science in Hospitality Management', 'code' => 'BSHM'],
                ['name' => 'Bachelor of Science in Tourism Management', 'code' => 'BSTM'],
            ],
            'CRIMINAL JUSTICE EDUCATION' => [
                ['name' => 'Bachelor of Science in Criminology', 'code' => 'BSCrim'],
            ],
        ];

        foreach ($departments as $deptName => $programs) {
            $department = \App\Models\Department::create(['name' => $deptName]);

            if ($deptName === 'SENIOR HIGH SCHOOL') {
                 foreach ($programs as $program) {
                    $department->seniorHighPrograms()->create($program);
                }
            } else {
                foreach ($programs as $program) {
                    $department->programs()->create($program);
                }
            }
        }
    }
}
