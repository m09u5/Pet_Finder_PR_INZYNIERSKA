import type {
  SearchFilterChangeHandler,
  SearchFilters,
  SearchSubmitHandler,
} from "@/components/navbar/search-bar/search-bar.types";

export interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onChangeAction: SearchFilterChangeHandler;
  onSubmitAction: SearchSubmitHandler;
}
