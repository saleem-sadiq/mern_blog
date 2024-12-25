import { parseDocument } from "htmlparser2";

// Define the structure of an Element in HTML
interface HTMLElement {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: HTMLElement[];
  data?: string;
}

// Utility function to process the children of a node and extract the text
const extractTextFromChildren = (children: HTMLElement[] = []): string | null => {
  const text = children
    .map((child) => {
      if (child.type === "text") return child.data?.trim() || "";
      if (child.children) return extractTextFromChildren(child.children);
      return "";
    })
    .join(" ")
    .trim();

  return text.length > 0 ? text : null; // Return null if no text is extracted
};

// Utility function to convert HTML to ProseMirror-style JSON
export function convertHTMLToEditorValue(html: string): { type: string; content: any[] } {
  const doc = parseDocument(html);
  const content: any[] = [];

  doc.children?.forEach((node: HTMLElement) => {
    if (node.type === "tag") {
      switch (node.name) {
        case "p":
          const paragraphText = extractTextFromChildren(node.children);
          if (paragraphText) {
            content.push({
              type: "paragraph",
              content: [{ type: "text", text: paragraphText }],
            });
          }
          break;

        case "h1":
          const headingTextH1 = extractTextFromChildren(node.children);
          if (headingTextH1) {
            content.push({
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: headingTextH1 }],
            });
          }
          break;

        case "h2":
          const headingTextH2 = extractTextFromChildren(node.children);
          if (headingTextH2) {
            content.push({
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: headingTextH2 }],
            });
          }
          break;

        case "h3":
          const headingTextH3 = extractTextFromChildren(node.children);
          if (headingTextH3) {
            content.push({
              type: "heading",
              attrs: { level: 3 },
              content: [{ type: "text", text: headingTextH3 }],
            });
          }
          break;

        case "ul":
          if (node.attribs?.["data-type"] === "taskList") {
            const taskItems = node.children
              ?.filter((liNode) => liNode.name === "li")
              .map((liNode) => ({
                type: "taskItem",
                attrs: { checked: liNode.attribs?.["data-checked"] === "true" },
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: extractTextFromChildren(liNode.children) }],
                  },
                ],
              })) || [];
            content.push({ type: "taskList", content: taskItems });
          } else {
            const listItems = node.children
              ?.filter((liNode) => liNode.name === "li")
              .map((liNode) => ({
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: extractTextFromChildren(liNode.children) }],
                  },
                ],
              })) || [];
            content.push({ type: "bulletList", attrs: { tight: true }, content: listItems });
          }
          break;

        case "ol":
          const orderedItems = node.children
            ?.filter((liNode) => liNode.name === "li")
            .map((liNode) => ({
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: extractTextFromChildren(liNode.children) }],
                },
              ],
            })) || [];
          content.push({ type: "orderedList", attrs: { start: 1, tight: true }, content: orderedItems });
          break;

        case "blockquote":
          const blockquoteText = extractTextFromChildren(node.children);
          if (blockquoteText) {
            content.push({
              type: "blockquote",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: blockquoteText }],
                },
              ],
            });
          }
          break;

        case "pre":
          const codeText = extractTextFromChildren(node.children);
          if (codeText) {
            content.push({
              type: "codeBlock",
              attrs: { language: null },
              content: [{ type: "text", text: codeText }],
            });
          }
          break;

        case "img":
          content.push({
            type: "image",
            attrs: {
              src: node.attribs?.src,
              alt: node.attribs?.alt || null,
              title: node.attribs?.title || null,
              width: node.attribs?.width || null,
              height: node.attribs?.height || null,
            },
          });
          break;

        case "iframe":
          if (node.attribs?.src?.includes("youtube.com")) {
            content.push({
              type: "youtube",
              attrs: {
                src: node.attribs.src,
                start: 0, // Default start time
                width: parseInt(node.attribs.width) || 640,
                height: parseInt(node.attribs.height) || 480,
              },
            });
          }
          break;

        case "a":
          if (node.attribs?.href?.includes("twitter.com")) {
            content.push({
              type: "twitter",
              attrs: { src: node.attribs.href },
            });
          }
          break;

        default:
          break;
      }
    }
  });

  return {
    type: "doc",
    content,
  };
}
