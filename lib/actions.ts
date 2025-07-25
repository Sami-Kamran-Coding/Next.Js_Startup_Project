"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

// ✅ Strongly typed input fields
export interface StartupFormFields {
  title: string;
  description: string;
  category: string;
  link: string;
}

// ✅ Optional: Type returned from writeClient.create()
interface CreatedStartup {
  _id: string;
  _type: string;
  title: string;
  description: string;
  category: string;
  image: string;
  slug: {
    _type: "slug";
    current: string;
  };
  author: {
    _type: "reference";
    _ref: string;
  };
  pitch: string;
}

export const createPitch = async (
  state: unknown, // ✅ Use `unknown` if not used; no need for `any`
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

  // ✅ Typed form entries
  const formEntries = Object.fromEntries(
    Array.from(form.entries()).filter(([key]) => key !== "pitch")
  );

  const { title, description, category, link } =
    formEntries as Record<keyof StartupFormFields, FormDataEntryValue>;

  const startupFields: StartupFormFields = {
    title: String(title ?? ""),
    description: String(description ?? ""),
    category: String(category ?? ""),
    link: String(link ?? ""),
  };

  const slug = slugify(startupFields.title, { lower: true, strict: true });

  try {
    const startup: Omit<CreatedStartup, "_id"> = {
      _type: "startup",
      title: startupFields.title,
      description: startupFields.description,
      category: startupFields.category,
      image: startupFields.link,
      slug: {
        _type: "slug",
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
