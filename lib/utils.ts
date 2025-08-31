import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Resend } from "resend";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const onlyNumbers = (value: string) => {
  return value.replace(/[^\d٠-٩]/g, "");
};

const resend = new Resend("re_AAY46E1E_K9FyiWZ1ifk6p5b6k6jXrDKw");

export async function sendMail(_adata: any) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello World",
    html: `<strong>${_adata}</strong>`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
