<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Thesis extends Model
{
    use HasUuids, HasFactory;

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

    protected $appends = [
        'pdf_url',
        'docx_url',
    ];

    protected static function booted()
    {
        static::saved(function ($model) {
            \Illuminate\Support\Facades\Cache::forget('dashboard_analytics');
        });
        static::deleted(function ($model) {
            \Illuminate\Support\Facades\Cache::forget('dashboard_analytics');
        });
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function primarySupervisor()
    {
        return $this->belongsTo(User::class, 'primary_supervisor_id');
    }

    public function getPdfUrlAttribute()
    {
        if (!$this->pdf_path) return null;
        if (env('FILESYSTEM_DISK') === 's3') {
            return \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl($this->pdf_path, now()->addMinutes(60), [
                'ResponseContentType' => 'application/pdf',
                'ResponseContentDisposition' => 'inline; filename="' . ($this->pdf_original_name ?? 'document.pdf') . '"',
            ]);
        }
        return url('storage/' . $this->pdf_path);
    }

    public function getDocxUrlAttribute()
    {
        return $this->docx_path ? \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl($this->docx_path, now()->addMinutes(60), [
            'ResponseContentType' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'ResponseContentDisposition' => 'attachment; filename="' . ($this->docx_original_name ?? 'document.docx') . '"',
        ]) : null;
    }
}
