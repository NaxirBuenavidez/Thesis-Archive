<?php
  
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThesisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'author' => $this->author,
            'co_author' => $this->co_author,
            'abstract' => $this->abstract,
            'discipline' => $this->discipline,
            'department' => $this->department,
            'degree_type' => $this->degree_type,
            'institution' => $this->institution,
            'keywords' => $this->keywords,
            'status' => $this->status,
            'submission_date' => $this->submission_date,
            'defense_date' => $this->defense_date,
            'embargo_until' => $this->embargo_until,
            'is_confidential' => (bool) $this->is_confidential,
            'doi' => $this->doi,
            'panelists' => $this->panelists,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'owner' => $this->whenLoaded('owner'),
            'primary_supervisor' => $this->whenLoaded('primarySupervisor'),
        ];

        // Conditional visibility based on route or permissions
        // For publicIndex (Archive), hide sensitive fields
        if ($request->routeIs('*.publicIndex') || ($this->is_confidential && !$request->user()?->can('view-confidential'))) {
            $hiddenFields = [
                'pdf_path', 
                'pdf_original_name', 
                'docx_path', 
                'docx_original_name', 
                'archived_by', 
                'recommended_by', 
                'review_checklist'
            ];
            foreach ($hiddenFields as $field) {
                unset($data[$field]);
            }
        } else {
            // Admin/Internal view includes these
            $data['pdf_path'] = $this->pdf_path;
            $data['pdf_original_name'] = $this->pdf_original_name;
            $data['docx_path'] = $this->docx_path;
            $data['docx_original_name'] = $this->docx_original_name;
            $data['archived_by'] = $this->archived_by;
            $data['recommended_by'] = $this->recommended_by;
            $data['review_checklist'] = $this->review_checklist;
        }

        return $data;
    }
}
