export interface Category {
  id: string;
  name: string;
  icon?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
}
