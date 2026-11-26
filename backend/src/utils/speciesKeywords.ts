const SPECIES_KEYWORD_GROUPS = [
  ["cat", "cats", "kot", "koty", "kotek", "kotki", "kotka", "kocię", "kocięta", "kociak", "kociaki"],
  ["dog", "dogs", "pies", "psy", "piesek", "pieski", "suczka", "szczenię", "szczenięta", "szczeniak", "szczeniaki"],
  ["rabbit", "rabbits", "królik", "króliki", "króliczek"],
  ["hamster", "hamsters", "chomik", "chomiki"],
  ["parrot", "parrots", "papuga", "papugi"],
];

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/ł/g, "l");
}

export function getSpeciesAliases(term: string): string[] {
  const needle = normalize(term);
  return SPECIES_KEYWORD_GROUPS.find((group) => group.some((alias) => normalize(alias) === needle)) ?? [];
}
