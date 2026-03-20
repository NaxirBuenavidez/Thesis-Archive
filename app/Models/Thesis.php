<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Thesis extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'author',
        'subtitle',
        'abstract',
        'discipline',
        'keywords',
        'status',
        'owner_id',
        'primary_supervisor_id',
        'degree_type',
        'institution',
        'department',
        'submission_date',
        'defense_date',
        'embargo_until',
        'is_confidential',
        'main_file_id',
        'doi',
        'pdf_path',
        'pdf_original_name',
        'docx_path',
        'docx_original_name',
        'co_author',
        'panelists',
        'review_checklist',
        'recommended_by',
        'archived_by',
    ];

    protected $casts = [
        'keywords' => 'array',
        'is_confidential' => 'boolean',
        'submission_date' => 'datetime',
        'defense_date' => 'datetime',
        'embargo_until' => 'datetime',
        'review_checklist' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function primarySupervisor()
    {
        return $this->belongsTo(User::class, 'primary_supervisor_id');
    }
}
