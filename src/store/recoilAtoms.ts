import { atom } from "recoil";

export const selectedCategoryState = atom<string>({
  key: "selectedCategoryState",
  default: "와인"
});
