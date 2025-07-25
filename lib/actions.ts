"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

interface StartupFormFields {
  title: string;
  description: string;
  category: string;
  link: string;
}

export const createPitch = async (
  state: unknown, // <-- use unknown if unused or strictly type it if needed
  form: FormData,
  pitch: string,
) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const formEntries = Object.fromEntries(
    Array.from(form.entries()).filter(([key]) => key !== "pitch")
  );

  const { title, description, category, link } = formEntries as Record<string, FormDataEntryValue>;

  const startupFields: StartupFormFields = {
    title: String(title ?? ""),
    description: String(description ?? ""),
    category: String(category ?? ""),
    link: String(link ?? ""),
  };

  const slug = slugify(String(title), { lower: true, strict: true });

  try {
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug", // <-- correct slug type
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      pitch,
    };

    const result = await writeClient.create(startup);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Failed to create pitch:", error);
    return parseServerActionResponse({
      error: error instanceof Error ? error.message : String(error),
      status: "ERROR",
    });
  }
};
