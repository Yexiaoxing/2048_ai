import { describe, expect, it } from "vitest";
import { safeParseJSON } from "./json";

describe("json", () => {
    it("should parse valid JSON", () => {
        const json = '{"name": "John", "age": 30}';
        const result = safeParseJSON<{ name: string; age: number }>(json, { name: "", age: 0 });
        expect(result).toEqual({ name: "John", age: 30 });
    });

    it("should return default value if JSON is invalid", () => {
        const json = "invalid JSON";
        const result = safeParseJSON<{ name: string; age: number }>(json, { name: "", age: 0 });
        expect(result).toEqual({ name: "", age: 0 });
    });
});
