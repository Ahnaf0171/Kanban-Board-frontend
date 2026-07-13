export interface ImageAsset {
  id: number;
  file: string;
  order: number;
  uploaded_by: number;
  uploaded_at: string;
  annotations: Annotation[];
}

export interface ReorderImageInput {
  order: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  id: number;
  image: number;
  points: Point[];
  label: string;
  color: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnotationInput {
  image: number;
  points: Point[];
  label: string;
  color: string;
}

export interface UpdateAnnotationInput {
  label?: string;
  points?: Point[];
  color?: string;
}
