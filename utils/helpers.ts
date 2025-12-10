/**
 * Safely clone objects that might contain non-cloneable properties
 * @param obj The object to clone
 * @returns A deep clone of the object
 */
export function safeClone<T>(obj: T): T {
  // Check if the object is null or not an object type
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle special types like Date, etc.
  if (obj instanceof Date) {
    return new Date(obj) as unknown as T;
  }

  // Create a new instance with the appropriate prototype
  const result = Array.isArray(obj) ? [] : {};

  // Copy properties
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // Recursively clone nested objects
      (result as any)[key] = typeof value === "object" && value !== null
        ? safeClone(value)
        : value;
    }
  }

  return result as T;
}

/**
 * Utility function to fetch resources through the background script (bypassing CORS)
 */
export async function backgroundFetch(url: string, options: RequestInit = {}): Promise<{
  ok: boolean;
  status?: number;
  statusText?: string;
  data?: string;
  error?: string;
}> {
  try {
    // Send a message to the background script to perform the fetch
    const response = await browser.runtime.sendMessage({
      type: "fetch",
      url,
      options,
    });

    // Check if response is undefined (communication issue)
    if (response === undefined) {
      console.error("[autodarts-liga] Background fetch failed: No response from background script");
      return {
        ok: false,
        error: "No response from background script. This may be due to a messaging issue.",
      };
    }

    return response;
  } catch (error) {
    console.error("[autodarts-liga] Error in backgroundFetch:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

