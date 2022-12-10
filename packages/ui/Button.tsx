import { HTMLAttributes } from "react";

export const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={`px-5 rounded-full bg-stone-200 ${props.className}`}
    />
  );
};
