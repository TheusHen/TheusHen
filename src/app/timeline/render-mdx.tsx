import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx-components";

export async function renderMdx(source: string) {
    try {
        const { default: Content } = await evaluate(source, {
            ...runtime,
            remarkPlugins: [remarkGfm],
        });
        return <Content components={mdxComponents} />;
    } catch (error) {
        console.error("[timeline] MDX compile failed:", error);
        return <p className="text-sm text-zinc-500">{source}</p>;
    }
}
