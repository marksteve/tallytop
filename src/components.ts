import { apply } from "twind";

export const list = apply`flex-1 flex flex-col p-3 gap-3 overflow-y-auto`;

export const item = apply`
  bg-white
  border
  flex
  items-center
  justify-between
  min-h-[3.5em]
  overflow-hidden
  rounded
`;

export const button = apply`
  border-1
  border-white
  px-5
  rounded
  text-white
`;

export const number = apply`text-gray-500 px-3 py-2 text-center border-1 rounded leading-loose`;
